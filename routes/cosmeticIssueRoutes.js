const express = require('express');
const router = express.Router();
const CosmeticIssue = require('../models/cosmeticIssueOption');

// Create new Cosmetic Issue Option
router.post('/', async (req, res) => {
  try {
    const newOption = new CosmeticIssue(req.body);
    await newOption.save();
    res.status(201).json(newOption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Cosmetic Issue Options
router.get('/', async (req, res) => {
  try {
    const options = await CosmeticIssue.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Cosmetic Issue Option
router.put('/:id', async (req, res) => {
  try {
    const option = await CosmeticIssue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(option);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Cosmetic Issue Option
router.delete('/:id', async (req, res) => {
  try {
    await CosmeticIssue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cosmetic Issue Option deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
