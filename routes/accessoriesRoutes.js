const express = require('express');
const router = express.Router();
const Accessories = require('../models/accessoriesOption');

// Create Accessories Option
router.post('/', async (req, res) => {
    try {
        const newOption = new Accessories(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Accessories Options
router.get('/', async (req, res) => {
    try {
        const options = await Accessories.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an Accessories Option
router.put('/:id', async (req, res) => {
    try {
        const option = await Accessories.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an Accessories Option
router.delete('/:id', async (req, res) => {
    try {
        await Accessories.findByIdAndDelete(req.params.id);
        res.json({ message: 'Accessories Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
