const express = require('express');
const router = express.Router();
const Faults = require('../models/Faults'); // Updated to use Faults model

// @route   GET /api/faults
// @desc    Get all fault conditions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const faults = await Faults.find();
    res.json(faults);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/faults/:id
// @desc    Get a specific fault condition by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const fault = await Faults.findById(req.params.id);
    if (!fault) {
      return res.status(404).json({ message: 'Fault condition not found' });
    }
    res.json(fault);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/faults
// @desc    Create a new fault condition
// @access  Public
router.post('/', async (req, res) => {
  const { condition, deductionPercentage, image } = req.body;

  try {
    const newFault = new Faults({
      condition,
      deductionPercentage,
      image,
    });

    const fault = await newFault.save();
    res.json(fault);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/faults/:id
// @desc    Update a fault condition by ID
// @access  Public
router.put('/:id', async (req, res) => {
  const { condition, deductionPercentage, image } = req.body;

  try {
    let fault = await Faults.findById(req.params.id);

    if (!fault) {
      return res.status(404).json({ message: 'Fault condition not found' });
    }

    fault.condition = condition || fault.condition;
    fault.deductionPercentage = deductionPercentage || fault.deductionPercentage;
    fault.image = image || fault.image;

    fault = await fault.save();
    res.json(fault);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/faults/:id
// @desc    Delete a fault condition by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const fault = await Faults.findById(req.params.id);

    if (!fault) {
      return res.status(404).json({ message: 'Fault condition not found' });
    }

    await fault.remove();
    res.json({ message: 'Fault condition removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
