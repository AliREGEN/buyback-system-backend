const express = require('express');
const axios = require('axios');
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
      // Customer details
      fullName,
      whatsapp,
      isInLahore,
      buyingPreference,
      address,
      // IP and Location
      location,
    } = req.body;

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Create new inspection object
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
      faults: faults.map(fault => ({
        header: fault.header,
        value: fault.description,
      })),
      repair: repair.map(repairItem => ({
        repair: repairItem.repair,
      })),
      cosmeticIssues: cosmeticIssues.map(issue => ({
        header: issue.header,
        value: issue.description,
      })),
      frontScreen,
      back,
      side,
      pta,
      accessories,
      fullName,
      whatsapp,
      isInLahore,
      buyingPreference,
      address,
      ipAddress,
      location,
    });

    // Save inspection to MongoDB
    await newInspection.save();

    // Send data to Zapier webhook
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/12005261/2hi9mrt/';

    // Prepare the payload to send to Zapier
    const zapierPayload = {
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
      fullName,
      whatsapp,
      isInLahore,
      buyingPreference,
      address,
      ipAddress,
      location,
    };

    // Send POST request to Zapier webhook
    await axios.post(zapierWebhookUrl, zapierPayload);

    // Respond with success
    res.status(201).json(newInspection);
  } catch (error) {
    console.error('Error saving inspection or sending to Zapier:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get IP and location data via backend
require('dotenv').config();

router.get('/get-ip-location', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const locationResponse = await axios.get(`https://ipinfo.io/${ip}/geo?token=${process.env.IPINFO_TOKEN}`);
    const { city, region, country, loc } = locationResponse.data;
    const [latitude, longitude] = loc.split(',');

    res.status(200).json({ ip, city, region, country, latitude, longitude });
  } catch (error) {
    console.error('Error fetching IP/location:', error);
    res.status(500).json({ message: 'Failed to fetch IP and location.' });
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
