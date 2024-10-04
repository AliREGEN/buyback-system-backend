const express = require('express');
const router = express.Router();
const SIMVariant = require('../models/simVariantOption');

// Create SIM Variant Option
router.post('/', async (req, res) => {
    try {
        const newOption = new SIMVariant(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all SIM Variant Options
router.get('/', async (req, res) => {
    try {
        const options = await SIMVariant.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a SIM Variant Option
router.put('/:id', async (req, res) => {
    try {
        const option = await SIMVariant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a SIM Variant Option
router.delete('/:id', async (req, res) => {
    try {
        await SIMVariant.findByIdAndDelete(req.params.id);
        res.json({ message: 'SIM Variant Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
