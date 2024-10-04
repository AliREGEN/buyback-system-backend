const express = require('express');
const router = express.Router();
const PTA = require('../models/ptaOption');

// Create PTA Option
router.post('/', async (req, res) => {
    try {
        const newOption = new PTA(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all PTA Options
router.get('/', async (req, res) => {
    try {
        const options = await PTA.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a PTA Option
router.put('/:id', async (req, res) => {
    try {
        const option = await PTA.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a PTA Option
router.delete('/:id', async (req, res) => {
    try {
        await PTA.findByIdAndDelete(req.params.id);
        res.json({ message: 'PTA Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
