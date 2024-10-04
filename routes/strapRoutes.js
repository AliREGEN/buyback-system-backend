const express = require('express');
const router = express.Router();
const Strap = require('../models/strapOption');

// Create Strap Option
router.post('/', async (req, res) => {
    try {
        const newOption = new Strap(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Strap Options
router.get('/', async (req, res) => {
  try {
    const { deviceType } = req.query; // Fetch the deviceType from query parameters

    // If deviceType is provided, filter by it, otherwise return all options
    const filter = deviceType ? { deviceType } : {};
    const options = await Strap.find(filter);

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an Strap Option
router.put('/:id', async (req, res) => {
    try {
        const option = await Strap.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an Strap Option
router.delete('/:id', async (req, res) => {
    try {
        await Strap.findByIdAndDelete(req.params.id);
        res.json({ message: 'Strap Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
