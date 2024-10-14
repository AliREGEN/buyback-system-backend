const express = require('express');
const router = express.Router();
const ActivatedSince = require('../models/activatedSinceOption');

// Create new Battery Health Option
router.post('/', async (req, res) => {
  try {
    const newOption = new ActivatedSince(req.body);
    await newOption.save();
    res.status(201).json(newOption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Battery Health Options filtered by deviceType
router.get('/', async (req, res) => {
  try {
    const { deviceType } = req.query; // Fetch the deviceType from query parameters

    // If deviceType is provided, filter by it, otherwise return all options
    const filter = deviceType ? { deviceType } : {};
    const options = await ActivatedSince.find(filter);

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Battery Health Option
router.put('/:id', async (req, res) => {
  try {
    const option = await ActivatedSince.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(option);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Battery Health Option
router.delete('/:id', async (req, res) => {
  try {
    await ActivatedSince.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activated Since Option deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
