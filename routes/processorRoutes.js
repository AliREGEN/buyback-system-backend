const express = require('express');
const router = express.Router();
const Processor = require('../models/processorOption');

// Create Processor Option
router.post('/', async (req, res) => {
    try {
        const newOption = new Processor(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Processor Options
router.get('/', async (req, res) => {
  try {
    const { deviceType } = req.query; // Fetch the deviceType from query parameters

    // If deviceType is provided, filter by it, otherwise return all options
    const filter = deviceType ? { deviceType } : {};
    const options = await Processor.find(filter);

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Processor Option
router.put('/:id', async (req, res) => {
    try {
        const option = await Processor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a Processor Option
router.delete('/:id', async (req, res) => {
    try {
        await Processor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Processor Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
