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
router.post('/apply/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const { presetId, deviceType } = req.body;

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

    const preset = await Preset.findById(presetId);
    if (!preset) {
      return res.status(404).json({ message: 'Preset not found' });
    }

    const applyDeductions = (deviceCategory = [], presetCategory = []) => {
  // Ensure that both deviceCategory and presetCategory are arrays
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


    for (const category of Object.keys(preset._doc)) {
      if (deviceModel[category] && preset[category]) {
        deviceModel[category] = applyDeductions(deviceModel[category], preset[category]);
      }
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
