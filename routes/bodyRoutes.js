const express = require('express');
const router = express.Router();
const Body = require('../models/bodyOption');

// Create Body Option
router.post('/', async (req, res) => {
    try {
        const newOption = new Body(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Body Options
router.get('/', async (req, res) => {
    try {
        const options = await Body.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a Body Option
router.put('/:id', async (req, res) => {
    try {
        const option = await Body.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a Body Option
router.delete('/:id', async (req, res) => {
    try {
        await Body.findByIdAndDelete(req.params.id);
        res.json({ message: 'Body Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
