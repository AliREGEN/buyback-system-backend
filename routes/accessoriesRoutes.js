const express = require('express');
const router = express.Router();
const Accessories = require('../models/Accessories');

// Get all Accessories options
router.get('/', async (req, res) => {
  try {
    const options = await Accessories.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Accessories option
router.put('/:id', async (req, res) => {
  try {
    const { deductionPercentage } = req.body;

    const updatedOption = await Accessories.findByIdAndUpdate(
      req.params.id,
      { deductionPercentage },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: 'Accessories option not found' });
    }

    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
