const express = require('express');
const axios = require('axios');
const router = express.Router();
const Inspection = require('../models/Inspection');

// starting value for the submission ID counter
let currentInspectionNumber = 7097;

// Route to create a new inspection
router.post('/', async (req, res) => {
  try {
    const {
      modelName,
      maxPrice,
      finalPrice,
      deviceType,
      watchCaseType,
      watchCaseFinish,
      watchCaseSize,
      band,
      strap,
      storageSize,
      colorOption,
      simOption,
      memorySize,
      processorType,
      connectivity,
      batteryHealth,
      activatedSince,
      isFaulty,
      isRepaired,
      isDamaged,
      faults,
      repair,
      cosmeticIssues,
      frontScreen,
      back,
      side,
      body,
      pta,
      accessories,
      applePencil,
      paymentOption,
      unknownPart,  // Moved to a global level
      // Customer details
      fullName,
      whatsapp,
      isInLahore,
      buyingPreference,
      address,
      acceptedTerms,
      acceptedInspection,
      // IP and Location
      location,
    } = req.body;

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Generate a unique inspection ID based on the device type
    const prefixMap = {
      iPhone: 'IP',
      iPad: 'ID',
      Samsung: 'SM',
      MacBook: 'MB',
      Watch: 'AW',
      Accessories: 'AC',
    }

    const prefix = prefixMap[deviceType] || 'OT';
    const inspectionId = `#RN-PK-${prefix}${currentInspectionNumber}`;

    // Increment the inspection number
    currentInspectionNumber += 1;

    // Construct processorType if present
    const newProcessorType = processorType ? {
      type: processorType.type, 
      cpuCores: processorType.cpuCores, 
      gpuCores: processorType.gpuCores, 
      speed: processorType.speed,
    } : undefined;

    // Create new inspection object
    const newInspection = new Inspection({
      inspectionId,
      modelName,
      maxPrice,
      finalPrice,
      deviceType,
      watchCaseType,
      watchCaseFinish,
      watchCaseSize,
      strap,
      band,
      storageSize,
      colorOption,
      simOption,
      memorySize,
      processorType: newProcessorType,
      connectivity,
      batteryHealth,
      activatedSince,
      isFaulty,
      isRepaired,
      isDamaged,
      faults: faults.map(fault => ({
        header: fault.header,
        value: fault.description,
      })),
      repair: repair.map(repairItem => ({
        repair: repairItem.repair,
      })),
      unknownPart, // Storing unknownPart as a global field
      cosmeticIssues: cosmeticIssues.map(issue => ({
        header: issue.header,
        value: issue.description,
      })),
      frontScreen,
      back,
      side,
      body,
      pta,
      accessories,
      applePencil,
      paymentOption,
      fullName,
      whatsapp,
      isInLahore,
      buyingPreference,
      address,
      acceptedTerms,
      acceptedInspection,
      ipAddress,
      location,
    });

    // Save inspection to MongoDB
    await newInspection.save();

    // Send POST request to Zapier webhook (optional)
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/12005261/2hi9mrt/';
    const zapierPayload = { ...newInspection._doc }; // Simplified payload

    await axios.post(zapierWebhookUrl, zapierPayload);

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

    // Fetch location data from IPinfo
    const locationResponse = await axios.get(`https://ipinfo.io/${ip}/geo?token=${process.env.IPINFO_TOKEN}`);
    const { city, region, country, loc } = locationResponse.data;

    let latitude, longitude;

    // Check if 'loc' is available and split it correctly
    if (loc) {
      [latitude, longitude] = loc.split(',');
    } else {
      latitude = null;
      longitude = null;
    }

    res.status(200).json({ ip, city, region, country, latitude, longitude });
  } catch (error) {
    console.error('Error fetching IP/location:', error.message);
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
