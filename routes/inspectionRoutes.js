const express = require('express');
const router = express.Router();
const Inspection = require('../models/Inspection');

// Route to create a new inspection
router.post('/', async (req, res) => {
  try {
    const {
      modelName,
      maxPrice,
      finalPrice,
      storageSize,
      colorOption,
      simOption,
      batteryHealth,
      isFunctional,
      isRepaired,
      isDamaged,
      faults,
      repair,
      cosmeticIssues,
      frontScreen,
      back,
      side,
      pta,
      accessories,
    } = req.body;

    const newInspection = new Inspection({
      modelName,
      maxPrice,
      finalPrice,
      storageSize,
      colorOption,
      simOption,
      batteryHealth,
      isFunctional,
      isRepaired,
      isDamaged,
      faults,
      repair,
      cosmeticIssues,
      frontScreen,
      back,
      side,
      pta,
      accessories,
    });

    await newInspection.save();
    res.status(201).json(newInspection);
  } catch (error) {
    console.error('Error saving inspection:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get all inspections
router.get('/', async (req, res) => {
  try {
    const inspections = await Inspection.find();
    res.status(200).json(inspections);
  } catch (error) {
    console.error('Error fetching inspections:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get an inspection by ID
router.get('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.status(200).json(inspection);
  } catch (error) {
    console.error('Error fetching inspection:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
