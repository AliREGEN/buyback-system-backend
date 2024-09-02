const express = require('express');
const router = express.Router();
const CosmeticIssues = require('../models/CosmeticIssues'); // Import the CosmeticIssues model

// @route   GET /api/cosmetic-issues
// @desc    Get all cosmetic issues
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cosmeticIssues = await CosmeticIssues.find();
    res.json(cosmeticIssues);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cosmetic-issues/:id
// @desc    Get a specific cosmetic issue by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cosmeticIssue = await CosmeticIssues.findById(req.params.id);
    if (!cosmeticIssue) {
      return res.status(404).json({ message: 'Cosmetic issue not found' });
    }
    res.json(cosmeticIssue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cosmetic-issues
// @desc    Create a new cosmetic issue
// @access  Public
router.post('/', async (req, res) => {
  const { header, condition, deductionPercentage, image } = req.body;

  try {
    const newCosmeticIssue = new CosmeticIssues({
      header,
      condition,
      deductionPercentage,
      image,
    });

    const cosmeticIssue = await newCosmeticIssue.save();
    res.json(cosmeticIssue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cosmetic-issues/:id
// @desc    Update a cosmetic issue by ID
// @access  Public
router.put('/:id', async (req, res) => {
  const { header, condition, deductionPercentage, image } = req.body;

  try {
    let cosmeticIssue = await CosmeticIssues.findById(req.params.id);

    if (!cosmeticIssue) {
      return res.status(404).json({ message: 'Cosmetic issue not found' });
    }

    cosmeticIssue.header = header || cosmeticIssue.header;
    cosmeticIssue.condition = condition || cosmeticIssue.condition;
    cosmeticIssue.deductionPercentage = deductionPercentage || cosmeticIssue.deductionPercentage;
    cosmeticIssue.image = image || cosmeticIssue.image;

    cosmeticIssue = await cosmeticIssue.save();
    res.json(cosmeticIssue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cosmetic-issues/:id
// @desc    Delete a cosmetic issue by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const cosmeticIssue = await CosmeticIssues.findById(req.params.id);

    if (!cosmeticIssue) {
      return res.status(404).json({ message: 'Cosmetic issue not found' });
    }

    await cosmeticIssue.remove();
    res.json({ message: 'Cosmetic issue removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
