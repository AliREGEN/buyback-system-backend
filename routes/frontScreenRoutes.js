const express = require('express');
const router = express.Router();
const FrontScreen = require('../models/frontScreenOption');

// Create Front Screen Option
router.post('/', async (req, res) => {
    try {
        const newOption = new FrontScreen(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Front Screen Options
router.get('/', async (req, res) => {
  try {
    const { deviceType } = req.query; // Fetch the deviceType from query parameters

    // If deviceType is provided, filter by it, otherwise return all options
    const filter = deviceType ? { deviceType } : {};
    const options = await FrontScreen.find(filter);

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Front Screen Option
router.put('/:id', async (req, res) => {
    try {
        const option = await FrontScreen.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a Front Screen Option
router.delete('/:id', async (req, res) => {
    try {
        await FrontScreen.findByIdAndDelete(req.params.id);
        res.json({ message: 'Front Screen Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
