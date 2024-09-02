const express = require('express');
const router = express.Router();
const FrontScreen = require('../models/FrontScreen');

// Get all FrontScreen options
router.get('/', async (req, res) => {
  try {
    const options = await FrontScreen.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update FrontScreen option
router.put('/:id', async (req, res) => {
  try {
    const { deductionPercentage } = req.body;

    const updatedOption = await FrontScreen.findByIdAndUpdate(
      req.params.id,
      { deductionPercentage },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: 'Front Screen option not found' });
    }

    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
