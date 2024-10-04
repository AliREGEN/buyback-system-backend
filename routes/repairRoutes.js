const express = require('express');
const router = express.Router();
const Repair = require('../models/repairOption');

// Create Repair Option
router.post('/', async (req, res) => {
    try {
        const newOption = new Repair(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Repair Options
router.get('/', async (req, res) => {
    try {
        const options = await Repair.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a Repair Option
router.put('/:id', async (req, res) => {
    try {
        const option = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a Repair Option
router.delete('/:id', async (req, res) => {
    try {
        await Repair.findByIdAndDelete(req.params.id);
        res.json({ message: 'Repair Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
