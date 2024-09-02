const express = require('express');
const router = express.Router();
const SIMVariant = require('../models/SIMVariant');

// Get all SIM options
router.get('/', async (req, res) => {
  try {
    const options = await SIMVariant.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update SIM Variant option
router.put('/:id', async (req, res) => {
  try {
    const { deductionPercentage } = req.body;

    const updatedOption = await SIMVariant.findByIdAndUpdate(
      req.params.id,
      { deductionPercentage },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: 'SIM Variant option not found' });
    }

    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
