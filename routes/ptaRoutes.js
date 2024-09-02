const express = require('express');
const router = express.Router();
const PTA = require('../models/PTA');

// Get all PTA options
router.get('/', async (req, res) => {
  try {
    const options = await PTA.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update PTA option
router.put('/:id', async (req, res) => {
  try {
    const { deductionPercentage } = req.body;

    const updatedOption = await PTA.findByIdAndUpdate(
      req.params.id,
      { deductionPercentage },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: 'PTA option not found' });
    }

    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
