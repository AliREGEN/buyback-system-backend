const express = require('express');
const router = express.Router();
const BatteryHealth = require('../models/BatteryHealth');

// Get all battery health options
router.get('/', async (req, res) => {
  try {
    const options = await BatteryHealth.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update battery health option
router.put('/:id', async (req, res) => {
  try {
    const { deductionPercentage } = req.body;
    
    const updatedOption = await BatteryHealth.findByIdAndUpdate(
      req.params.id,
      { deductionPercentage },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: 'Battery health option not found' });
    }

    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
