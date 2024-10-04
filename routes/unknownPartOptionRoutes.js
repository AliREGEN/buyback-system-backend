const express = require('express');
const router = express.Router();
const UnknownPart = require('../models/unknownPartOption');

// Create Unknown Part Option
router.post('/', async (req, res) => {
    try {
        const newOption = new UnknownPart(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Unknown Part Options
router.get('/', async (req, res) => {
  try {
    const { deviceType } = req.query; // Fetch the deviceType from query parameters

    // If deviceType is provided, filter by it, otherwise return all options
    const filter = deviceType ? { deviceType } : {};
    const options = await UnknownPart.find(filter);

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an Unknown Part Option
router.put('/:id', async (req, res) => {
    try {
        const option = await UnknownPart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an Unknown Part Option
router.delete('/:id', async (req, res) => {
    try {
        await UnknownPart.findByIdAndDelete(req.params.id);
        res.json({ message: 'Unknown Part Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
