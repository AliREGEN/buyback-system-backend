const express = require('express');
const router = express.Router();
const Repair = require('../models/Repair');

// Get all display repair options
router.get('/', async (req, res) => {
  try {
    const options = await Repair.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update display repair option
router.put('/:id', async (req, res) => {
  try {
    const { deductionPercentage } = req.body;
    
    const updatedOption = await Repair.findByIdAndUpdate(
      req.params.id,
      { deductionPercentage },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: 'Repair option not found' });
    }

    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
