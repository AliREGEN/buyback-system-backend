const iPhone = require('../models/iPhone');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary configuration

// Set up multer for file handling
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage: storage });

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        folder: 'iphone_images',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
};

// Route to add a new iPhone
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    console.log('Received Body: ', req.body);
    console.log('Received Files: ', req.files);

    const { modelName, maxPrice, colors, storageSizes } = req.body;
    
    const colorsArray = colors ? colors.split(',') : [];
    const storageSizesArray = storageSizes ? storageSizes.split(',') : [];
    
    let colorImageArray = [];

    if (req.files && req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        const colorName = colorsArray[i];
        const file = req.files[i];
        const fileName = `${modelName.replace(/\s/g, '_')}_${colorName}_${uuidv4()}`;

        const imageUrl = await uploadToCloudinary(file, fileName);
        colorImageArray.push({ color: colorName, image: imageUrl });
      }
    } else {
      colorImageArray = colorsArray.map((color) => ({
        color,
        image: null,
      }));
    }

    // Default values for deduction categories
    const defaultBatteryHealth = [
      { health: '95% or Above', deductionPercentage: 5, image: '' },
      { health: '90% or Above', deductionPercentage: 10, image: '' },
      { health: '85% or Above', deductionPercentage: 15, image: '' },
      { health: '80% or Above', deductionPercentage: 20, image: '' },
      { health: 'Less than 80%', deductionPercentage: 25, image: '' }
    ];

    const defaultCosmeticIssues = [
      { header: 'Damaged Display', condition: 'Display glass is cracked or shattered', deductionPercentage: 10, image: '' },
      { header: 'Damaged Back', condition: 'Back glass is cracked or shattered', deductionPercentage: 10, image: '' },
      { header: 'Damaged Camera Lens', condition: 'Camera lens is cracked or shattered', deductionPercentage: 10, image: '' },
      { header: 'Damaged Frame', condition: 'Body is broken, bent or heavily dented', deductionPercentage: 15, image: '' }
    ];

    const defaultFaults = [
      { header: 'Faulty Display', condition: 'Spots/Dead pixels or visible lines on the display', deductionPercentage: 10, image: '' },
      { header: 'Faulty Earpiece', condition: 'Earpiece is not working or the audio is noisy', deductionPercentage: 10, image: '' },
      { header: 'Faulty Loudspeaker', condition: 'Loudspeaker is not working or the audio is noisy', deductionPercentage: 10, image: '' },
      { header: 'Faulty Face ID', condition: 'Face ID is not working or not working consistently', deductionPercentage: 10, image: '' },
      { header: 'Faulty Proximity Sensor', condition: 'Proximity sensor is not working - The display does not turn off during the phone call', deductionPercentage: 10, image: '' },
      { header: 'Faulty Vibration Motor', condition: 'Vibration motor is not working or there is a rattling noise', deductionPercentage: 10, image: '' },
      { header: 'Faulty Power Button', condition: 'Power button is not working or not working consistently', deductionPercentage: 10, image: '' },
      { header: 'Faulty Volume Button', condition: 'Volume button is not working or not working consistently', deductionPercentage: 10, image: '' },
      { header: 'Faulty Mute Button', condition: 'Mute button is not working or not working consistently', deductionPercentage: 10, image: '' },
      { header: 'Faulty Front Camera', condition: 'Front camera is not working or the image is blurry', deductionPercentage: 10, image: '' },
      { header: 'Faulty Rear Camera', condition: 'Rear camera is not working or the image is blurry', deductionPercentage: 10, image: '' },
      { header: 'Faulty Flash', condition: 'Flash is not working', deductionPercentage: 10, image: '' },
      { header: 'Faulty Microphone', condition: 'Microphone is not working or the audio is noisy', deductionPercentage: 10, image: '' },
      { header: 'Faulty Charging Port', condition: 'Charging port is faulty or the phone is not charging', deductionPercentage: 10, image: '' },
    ];

    const defaultRepairs = [
      { repair: 'Touch screen was replaced', deductionPercentage: 10, image: '' },
      { repair: 'Display was replaced', deductionPercentage: 10, image: '' },
      { repair: 'Front Camera was replaced', deductionPercentage: 10, image: '' },
      { repair: 'Back Camera was replaced', deductionPercentage: 10, image: '' },
      { repair: 'Speaker/Earpiece was replaced', deductionPercentage: 10, image: '' },
      { repair: 'Battery was replaced', deductionPercentage: 10, image: '' },
      { repair: 'Battery was replaced by REGEN', deductionPercentage: 10, image: '' },
      { repair: 'Motherboard/Logic board was repaired', deductionPercentage: 10, image: '' },
      { repair: 'Something else was repaired', deductionPercentage: 10, image: '' }
    ];

    const defaultFrontScreen = [
      { header: 'Excellent', condition: 'Very light signs of usage or 1 - 2 minor scratches', deductionPercentage: 5, image: '' },
      { header: 'Good', condition: 'Some signs of usage or a few minor scratches', deductionPercentage: 10, image: '' },
      { header: 'Fair', condition: 'Moderate signs of usage or visible scratches', deductionPercentage: 15, image: '' },
      { header: 'Acceptable', condition: 'Heavy signs of usage or deep scratches', deductionPercentage: 20, image: '' },
    ];

    const defaultBack = [
      { header: 'Excellent', condition: 'Very light signs of usage or 1 - 2 minor scratches', deductionPercentage: 5, image: '' },
      { header: 'Good', condition: 'Some signs of usage or a few minor scratches', deductionPercentage: 10, image: '' },
      { header: 'Fair', condition: 'Moderate signs of usage or visible scratches', deductionPercentage: 15, image: '' },
      { header: 'Acceptable', condition: 'Heavy signs of usage or deep scratches', deductionPercentage: 20, image: '' },
    ];

    const defaultSide = [
      { header: 'Excellent', condition: 'Very light signs of usage or 1 - 2 minor scratches', deductionPercentage: 5, image: '' },
      { header: 'Good', condition: 'Some signs of usage or a few minor scratches', deductionPercentage: 10, image: '' },
      { header: 'Fair', condition: 'Moderate signs of usage or visible scratches', deductionPercentage: 15, image: '' },
      { header: 'Acceptable', condition: 'Heavy signs of usage or deep scratches', deductionPercentage: 20, image: '' },
    ];

    const defaultSIMVariant = [
      { option: 'Dual eSIM', deductionPercentage: 5 },
      { option: 'Dual Physical SIM', deductionPercentage: 5 },
      { option: 'eSIM + Physical SIM', deductionPercentage: 5 }
    ];

    const defaultPTA = [
      { option: 'Is your iPhone PTA Approved?', deductionPercentage: 5 },
      { option: 'Is your iPhone Factory Unlocked?', deductionPercentage: 5 }
    ];

    const defaultAccessories = [
      { option: 'Everything (Complete Box)', deductionPercentage: 5, image: '' },
      { option: 'Box Only', deductionPercentage: 10, image: '' },
      { option: 'iPhone Only', deductionPercentage: 15, image: '' }
    ];

    const newiPhone = new iPhone({
      id: uuidv4(),
      modelName,
      maxPrice,
      colors: colorImageArray,
      storageSizes: storageSizesArray.map(size => ({
        size: size,
        deductionPercentage: 0,
      })),
      batteryHealth: defaultBatteryHealth,
      cosmeticIssues: defaultCosmeticIssues,
      faults: defaultFaults,
      repairs: defaultRepairs,
      frontScreen: defaultFrontScreen,
      back: defaultBack,
      side: defaultSide,
      simVariant: defaultSIMVariant,
      pta: defaultPTA,
      accessories: defaultAccessories,
    });

    await newiPhone.save();
    console.log('New iPhone with images and default deductions saved to MongoDB:', newiPhone);
    return res.status(201).json(newiPhone);
  } catch (error) {
    console.error('Error adding iPhone:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Update iPhone fields
router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body;

    const updatedIPhone = await iPhone.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedIPhone) {
      return res.status(404).json({ message: 'iPhone not found' });
    }

    res.json(updatedIPhone);
  } catch (error) {
    console.error('Error updating iPhone:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get all iPhones or fetch by ID
router.get('/', async (req, res) => {
  try {
    const id = req.query.id; // Use req.query.id to get the id from the query parameter

    if (id) {
      console.log(`Fetching iPhone with ID: ${id}`);
      const fetchedIPhone = await iPhone.findOne({ id: id }); // Use findOne with the custom id field

      if (fetchedIPhone) {
        res.json(fetchedIPhone);
      } else {
        res.status(404).json({ message: 'iPhone not found' });
      }
    } else {
      // If no id is provided, return all iPhones
      const iPhones = await iPhone.find();
      res.json(iPhones);
    }
  } catch (error) {
    console.error('Error retrieving iPhone:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get iPhone by model name
router.get('/:modelName', async (req, res) => {
  try {
    const modelName = req.params.modelName;
    if (!modelName) {
      return res.status(400).json({ message: 'Model name is required' });
    }

    const fetchedIPhone = await iPhone.findOne({ modelName }); // Use correct model
    if (!fetchedIPhone) {
      return res.status(404).json({ message: 'iPhone not found' });
    }

    res.json(fetchedIPhone);
  } catch (error) {
    console.error('Error retrieving iPhone:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
