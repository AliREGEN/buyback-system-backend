const express = require('express');
const router = express.Router();
const Back = require('../models/Back');

// Get all Back options
router.get('/', async (req, res) => {
  try {
    const options = await Back.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Back option
router.put('/:id', async (req, res) => {
  try {
    const { deductionPercentage } = req.body;

    const updatedOption = await Back.findByIdAndUpdate(
      req.params.id,
      { deductionPercentage },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: 'Back option not found' });
    }

    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
