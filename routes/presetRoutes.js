const express = require('express');
const router = express.Router();
const Preset = require('../models/Preset');
const iPhone = require('../models/iPhone');
const Samsung = require('../models/Samsung');
const iPad = require('../models/iPad');
const MacBook = require('../models/Macbook');
const Watch = require('../models/Watch');

// Create a new preset
router.post('/', async (req, res) => {
  try {
    const { modelName, vendor, deviceType, ...categories } = req.body;

    const existingPreset = await Preset.findOne({ modelName });
    if (existingPreset) {
      return res.status(400).json({ message: 'Preset with this model name already exists' });
    }

    const newPreset = new Preset({
      modelName,
      vendor,
      deviceType,
      ...categories,
    });

    await newPreset.save();
    res.status(201).json(newPreset);
  } catch (error) {
    console.error('Error creating preset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply a preset to a device
const applyDeductions = (deviceCategory = [], presetCategory = []) => {
  // Ensure that both deviceCategory and presetCategory are arrays before mapping
  if (!Array.isArray(deviceCategory) || !Array.isArray(presetCategory)) {
    return deviceCategory; // Return the original if not arrays
  }

  // Map over the deviceCategory and apply deductions from the presetCategory
  return deviceCategory.map((deviceOption) => {
    const matchingPreset = presetCategory.find((presetOption) => {
      return presetOption?.option && deviceOption?.option && presetOption.option.equals(deviceOption.option);
    });

    if (matchingPreset) {
      deviceOption.deductionPercentage = matchingPreset.deductionPercentage;  // Update deduction
    }
    return deviceOption;
  });
};

// In your route:
router.post('/apply/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const { presetId, deviceType } = req.body;

    // Get the device model
    let deviceModel;
    switch (deviceType) {
      case 'iPhone':
        deviceModel = await iPhone.findById(modelId);
        break;
      case 'iPad':
        deviceModel = await iPad.findById(modelId);
        break;
      case 'Samsung':
        deviceModel = await Samsung.findById(modelId);
        break;
      case 'Watch':
        deviceModel = await Watch.findById(modelId);
        break;
      case 'MacBook':
        deviceModel = await MacBook.findById(modelId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid device type.' });
    }

    if (!deviceModel) return res.status(404).json({ message: `${deviceType} not found` });

    // Get the preset data
    const preset = await Preset.findById(presetId).populate([
      'batteryHealth.option',
      'cosmeticIssues.option',
      'faults.option',
      'repairs.option',
      'frontScreen.option',
      'back.option',
      'side.option',
      'simVariant.option',
      'pta.option',
      'accessories.option',
      'connectivity.option',
      'body.option',
      'strap.option',
      'band.option',
      'applePencil.option',
      'processorTypes.option',
    ]);

    if (!preset) return res.status(404).json({ message: 'Preset not found' });

    // Apply deductions only for categories that exist in both device and preset
    if (preset.batteryHealth && deviceModel.batteryHealth) {
      deviceModel.batteryHealth = applyDeductions(deviceModel.batteryHealth, preset.batteryHealth);
    }
    if (preset.cosmeticIssues && deviceModel.cosmeticIssues) {
      deviceModel.cosmeticIssues = applyDeductions(deviceModel.cosmeticIssues, preset.cosmeticIssues);
    }
    if (preset.faults && deviceModel.faults) {
      deviceModel.faults = applyDeductions(deviceModel.faults, preset.faults);
    }
    if (preset.repairs && deviceModel.repairs) {
      deviceModel.repairs = applyDeductions(deviceModel.repairs, preset.repairs);
    }
    if (preset.frontScreen && deviceModel.frontScreen) {
      deviceModel.frontScreen = applyDeductions(deviceModel.frontScreen, preset.frontScreen);
    }
    if (preset.back && deviceModel.back) {
      deviceModel.back = applyDeductions(deviceModel.back, preset.back);
    }
    if (preset.side && deviceModel.side) {
      deviceModel.side = applyDeductions(deviceModel.side, preset.side);
    }
    if (preset.simVariant && deviceModel.simVariant) {
      deviceModel.simVariant = applyDeductions(deviceModel.simVariant, preset.simVariant);
    }
    if (preset.pta && deviceModel.pta) {
      deviceModel.pta = applyDeductions(deviceModel.pta, preset.pta);
    }
    if (preset.accessories && deviceModel.accessories) {
      deviceModel.accessories = applyDeductions(deviceModel.accessories, preset.accessories);
    }
    if (preset.connectivity && deviceModel.connectivity) {
      deviceModel.connectivity = applyDeductions(deviceModel.connectivity, preset.connectivity);
    }
    if (preset.body && deviceModel.body) {
      deviceModel.body = applyDeductions(deviceModel.body, preset.body);
    }
    if (preset.strap && deviceModel.strap) {
      deviceModel.strap = applyDeductions(deviceModel.strap, preset.strap);
    }
    if (preset.band && deviceModel.band) {
      deviceModel.band = applyDeductions(deviceModel.band, preset.band);
    }
    if (preset.applePencil && deviceModel.applePencil) {
      deviceModel.applePencil = applyDeductions(deviceModel.applePencil, preset.applePencil);
    }
    if (preset.processorTypes && deviceModel.processorTypes) {
      deviceModel.processorTypes = applyDeductions(deviceModel.processorTypes, preset.processorTypes);
    }


    await deviceModel.save();
    res.status(200).json({ message: 'Preset applied successfully', device: deviceModel });
  } catch (error) {
    console.error('Error applying preset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all presets
router.get('/', async (req, res) => {
  try {
    const presets = await Preset.find();
    res.status(200).json(presets);
  } catch (error) {
    console.error('Error fetching presets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
