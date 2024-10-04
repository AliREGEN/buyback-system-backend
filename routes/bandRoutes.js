const express = require('express');
const router = express.Router();
const Band = require('../models/bandOption');

// Create Band Option
router.post('/', async (req, res) => {
    try {
        const newOption = new Band(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Band Options
router.get('/', async (req, res) => {
  try {
    const { deviceType } = req.query; // Fetch the deviceType from query parameters

    // If deviceType is provided, filter by it, otherwise return all options
    const filter = deviceType ? { deviceType } : {};
    const options = await Band.find(filter);

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an Band Option
router.put('/:id', async (req, res) => {
    try {
        const option = await Band.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an Band Option
router.delete('/:id', async (req, res) => {
    try {
        await Band.findByIdAndDelete(req.params.id);
        res.json({ message: 'Band Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
