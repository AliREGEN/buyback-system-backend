const express = require('express');
const router = express.Router();
const iPhonePreset = require('../models/iPhonePreset');

// Create a new iPhone preset
router.post('/', async (req, res) => {
  try {
    const { modelName, vendor, deviceType, batteryHealth, cosmeticIssues, faults, repairs, frontScreen, back, side, simVariant, pta, accessories } = req.body;

    // Check if a preset with the same model name already exists
    const existingPreset = await iPhonePreset.findOne({ modelName });
    if (existingPreset) {
      return res.status(400).json({ message: 'Preset with this model name already exists' });
    }

    const newPreset = new iPhonePreset({
      modelName,
      vendor,
      deviceType,
      cosmeticIssues,
      faults,
      repairs,
      frontScreen,
      back,
      side,
      pta,
      accessories,
      unknownPart,
    });

    await newPreset.save();
    res.status(201).json(newPreset);
  } catch (error) {
    console.error('Error creating preset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all iPhone presets
router.get('/', async (req, res) => {
  try {
    const presets = await iPhonePreset.find();
    res.status(200).json(presets);
  } catch (error) {
    console.error('Error fetching presets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific iPhone preset by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const preset = await iPhonePreset.findById(id);

    if (!preset) {
      return res.status(404).json({ message: 'Preset not found' });
    }

    res.status(200).json(preset);
  } catch (error) {
    console.error('Error fetching preset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get a specific iPhone preset by model name
router.get('/:modelName', async (req, res) => {
  try {
    const { modelName } = req.params;
    const preset = await iPhonePreset.findOne({ modelName });

    if (!preset) {
      return res.status(404).json({ message: 'Preset not found' });
    }

    res.status(200).json(preset);
  } catch (error) {
    console.error('Error fetching preset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing iPhone preset
router.put('/:modelName', async (req, res) => {
  try {
    const { modelName } = req.params;
    const { paymentOptions, storageSizes, batteryHealth, cosmeticIssues, faults, repairs, frontScreen, back, side, simVariant, pta, accessories } = req.body;

    // Find the existing preset
    const existingPreset = await iPhonePreset.findOne({ modelName });
    if (!existingPreset) {
      return res.status(404).json({ message: 'Preset not found' });
    }

    // Update fields
    existingPreset.paymentOptions = paymentOptions || existingPreset.paymentOptions;
    existingPreset.storageSizes = storageSizes || existingPreset.storageSizes;
    existingPreset.batteryHealth = batteryHealth || existingPreset.batteryHealth;
    existingPreset.cosmeticIssues = cosmeticIssues || existingPreset.cosmeticIssues;
    existingPreset.faults = faults || existingPreset.faults;
    existingPreset.repairs = repairs || existingPreset.repairs;
    existingPreset.frontScreen = frontScreen || existingPreset.frontScreen;
    existingPreset.back = back || existingPreset.back;
    existingPreset.side = side || existingPreset.side;
    existingPreset.simVariant = simVariant || existingPreset.simVariant;
    existingPreset.pta = pta || existingPreset.pta;
    existingPreset.accessories = accessories || existingPreset.accessories;

    await existingPreset.save();
    res.status(200).json(existingPreset);
  } catch (error) {
    console.error('Error updating preset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an iPhone preset
router.delete('/:modelName', async (req, res) => {
  try {
    const { modelName } = req.params;

    const deletedPreset = await iPhonePreset.findOneAndDelete({ modelName });
    if (!deletedPreset) {
      return res.status(404).json({ message: 'Preset not found' });
    }

    res.status(200).json({ message: 'Preset deleted successfully' });
  } catch (error) {
    console.error('Error deleting preset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
