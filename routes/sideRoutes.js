const express = require('express');
const router = express.Router();
const Side = require('../models/sideOption');

// Create Side Option
router.post('/', async (req, res) => {
    try {
        const newOption = new Side(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Side Options
router.get('/', async (req, res) => {
    try {
        const options = await Side.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a Side Option
router.put('/:id', async (req, res) => {
    try {
        const option = await Side.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a Side Option
router.delete('/:id', async (req, res) => {
    try {
        await Side.findByIdAndDelete(req.params.id);
        res.json({ message: 'Side Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
