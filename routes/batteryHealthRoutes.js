const express = require('express');
const router = express.Router();
const BatteryHealth = require('../models/batteryHealthOption');

// Create new Battery Health Option
router.post('/', async (req, res) => {
  try {
    const newOption = new BatteryHealth(req.body);
    await newOption.save();
    res.status(201).json(newOption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Battery Health Options
router.get('/', async (req, res) => {
  try {
    const options = await BatteryHealth.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Battery Health Option
router.put('/:id', async (req, res) => {
  try {
    const option = await BatteryHealth.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(option);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Battery Health Option
router.delete('/:id', async (req, res) => {
  try {
    await BatteryHealth.findByIdAndDelete(req.params.id);
    res.json({ message: 'Battery Health Option deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
