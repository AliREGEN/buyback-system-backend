const MacBook = require('../models/Macbook');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage: storage });

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        folder: 'macbook_images',
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

// Create a new MacBook model
router.post('/', upload.any(), async (req, res) => {
  try {
    console.log('Received Body: ', req.body);
    console.log('Received Files: ', req.files);

    const {vendor, deviceType, modelName, maxPrice, colors, memorySizes ,storageSizes, processorTypes ,paymentOptions } = req.body;
    
    const colorsArray = colors ? colors.split(',') : [];
    const storageSizesArray = storageSizes ? storageSizes.split(',') : [];
    const memorySizesArray = memorySizes ? memorySizes.split(',') : [];

    const processorTypesArray = Array.isArray(processorTypes) 
      ? processorTypes 
      : JSON.parse(processorTypes);

    
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

    const defaultBatteryHealth = [
        { health: '95% or Above', deductionPercentage: 0 },
        { health: '90% or Above', deductionPercentage: 0 },
        { health: '85% or Above', deductionPercentage: 0 },
        { health: '80% or Above', deductionPercentage: 0 },
        { health: 'Less than 80%', deductionPercentage: 0 },
      ];


    const defaultCosmeticIssues = [
      { header: 'Damaged Display', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/w5gsvgwfpkzpsx6k4an9' },
      { header: 'Damaged Body', condition: 'Broken/Bent', deductionPercentage: 0, image: '' }
    ];

    const paymentOptionsArray = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
    console.log('Payment Options Array: ', paymentOptionsArray);


    const defaultFaults = [
      { header: 'Faulty Display', condition: 'Dead Pixels/Spots/Lines', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/xypgkalx2bsb4fqvtrkx' },
      { header: 'Faulty Earpiece', condition: 'No Audio/Noisy Audio', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/a0wdieodeqzxalb2xxya' },
      { header: 'Faulty Touch ID', condition: 'Touch ID Not Working', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/q5cdb1z1grb3vlrjiwsl' },
      { header: 'Faulty Power Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/qegdoyic1egs01excx4e' },
      { header: 'Faulty Speaker', condition: 'No Audio/Noisy Audio', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/mfcoz9abwcemw8hlkoci' },
      { header: 'Faulty Charging Port', condition: 'Dead/Not Working', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/t5rehbtdmceufmpufgom' },
    ];

    const defaultRepairs = [
      { repair: 'Display Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/tfawle3cdpflyta3lnlg' },
      { repair: 'FaceTime HD Camera Replaced', deductionPercentage: 0, image: '' },
      { repair: 'Speaker Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/gf4xtvvrfag3kfy8diry' },
      { repair: 'Microphone Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/hhs9zk7179ylqzusdi4p' },
      { repair: 'Battery Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/vqw9yzwqlchs7ils53qs' },
      { repair: 'Battery Replaced by REGEN', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/vqw9yzwqlchs7ils53qs' },
      { repair: 'Motherboard Repaired', deductionPercentage: 0, image: '' },
      { repair: 'Other Repairs', deductionPercentage: 0, image: '' }
    ];

    const defaultFrontScreen = [
      { header: 'Excellent', condition: '1 - 2 hardly visible scratches or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no deep scratches', deductionPercentage: 0},
      { header: 'Fair', condition: 'Visible scratches, swirls, 1 - 2 minor deep scratches', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Too many scratches, swirls, noticeable deep scratches', deductionPercentage: 0 },
    ];

    const defaultBody = [
      { header: 'Excellent', condition: '1 - 2 hardly visible scratches or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no scuffs or dents', deductionPercentage: 0},
      { header: 'Fair', condition: 'Visible scratches, 1 - 2 minor scuffs or dents', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Too many scratches, noticeable scuffs or dents', deductionPercentage: 0 },
    ];

    const defaultAccessories = [
      { option: 'Everything (Complete Box)', deductionPercentage: 0, image: '' },
      { option: 'Box Only', deductionPercentage: 0, image: '' },
      { option: 'MacBook Only', deductionPercentage: 0, image: '' }
    ];

    const newMacBook = new MacBook({
      id: uuidv4(),
      vendor,
      deviceType,
      modelName,
      maxPrice,
      colors: colorImageArray,
      storageSizes: storageSizesArray.map(size => ({
        size: size,
        deductionPercentage: 0,
      })),
        memorySizes: memorySizesArray.map(size => ({
            size: size,
            deductionPercentage: 0,
        })),
        paymentOptions: paymentOptionsArray,
        processorTypes: processorTypesArray.map((processor) => ({
        type: processor.type,
        cpuCores: processor.cpuCores || '',
        gpuCores: processor.gpuCores || '',
        speed: processor.speed || '',
        deductionPercentage: processor.deductionPercentage || 0,
      })),
      batteryHealth: defaultBatteryHealth,
      cosmeticIssues: defaultCosmeticIssues,
      faults: defaultFaults,
      repairs: defaultRepairs,
      frontScreen: defaultFrontScreen,
      body: defaultBody,
      accessories: defaultAccessories,
    });

    await newMacBook.save();
    console.log('New MacBook with images and with filtered battery health saved to MongoDB:', newMacBook);
    return res.status(201).json(newMacBook);
  } catch (error) {
    console.error('Error adding MacBook:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', upload.any(), async (req, res) => {
  try {
    const {
      vendor,
      deviceType,
      modelName,
      processorTypes,
      maxPrice,
      storageSizes,
      memorySizes,
      paymentOptions,
      batteryHealth,
      cosmeticIssues,
      faults,
      repairs,
      frontScreen,
      body,
      accessories,
      colors, // Colors as comma-separated string

    } = req.body;

    const existingMacBook = await MacBook.findById(req.params.id);
    if (!existingMacBook) {
      return res.status(404).json({ message: 'MacBook not found' });
    }

    // Logging received body and files for debugging
    console.log('Received Body:', req.body);
    console.log('Received Files:', req.files);

    // Update basic fields
    if (vendor) existingMacBook.vendor = vendor;
    if (deviceType) existingMacBook.deviceType = deviceType;
    if (modelName) existingMacBook.modelName = modelName;
    if (maxPrice) existingMacBook.maxPrice = maxPrice;


    // Handle colors and image uploads
    if (colors) {
      const colorsArray = colors.split(',');

      const updatedColors = await Promise.all(colorsArray.map(async (color) => {
        const existingColor = existingMacBook.colors.find(c => c.color === color);
        const uploadedImage = req.files.find(file => file.fieldname === `images_${color}`);

        console.log(`Processing color: ${color}, existingColor: ${existingColor ? existingColor.color : 'N/A'}`);

        let imageUrl = existingColor?.image || '';

        if (uploadedImage) {
          console.log(`Uploading image for color: ${color}`);
          const fileName = `${modelName.replace(/\s/g, '_')}_${color}_${uuidv4()}`;
          imageUrl = await uploadToCloudinary(uploadedImage, fileName);
          console.log(`Uploaded image URL: ${imageUrl}`);
        }

        return { color, image: imageUrl };
      }));

      existingMacBook.colors = updatedColors;
    }

    // Update storage sizes (ensure storageSizes is an array)
    if (storageSizes) {
      const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
      existingMacBook.storageSizes = storageSizesArray.map(size => ({
        size: typeof size === 'object' ? size.size : size, // Handle case if size is an object
        deductionPercentage: size.deductionPercentage || 0, // Default to 0 if not provided
      }));
    }

    // Update memory sizes (ensure memorySizes is an array)
    if (memorySizes) {
        const memorySizesArray = Array.isArray(memorySizes) ? memorySizes : memorySizes.split(',');
        existingMacBook.memorySizes = memorySizesArray.map(size => ({
            size: typeof size === 'object' ? size.size : size, // Handle case if size is an object
            deductionPercentage: size.deductionPercentage || 0, // Default to 0 if not provided
        }));
    }

    if (processorTypes) {
      const processorTypesArray = Array.isArray(processorTypes)
        ? processorTypes
        : JSON.parse(processorTypes);

      existingMacBook.processorTypes = processorTypesArray.map((processor) => ({
        type: processor.type,
        cpuCores: processor.cpuCores || '',
        gpuCores: processor.gpuCores || '',
        speed: processor.speed || '',
        deductionPercentage: processor.deductionPercentage || 0,
      }));
    }


    // Update payment options
    if (paymentOptions) {
      const paymentOptionsArray = Array.isArray(paymentOptions)
        ? paymentOptions
        : JSON.parse(paymentOptions);

      // Check and update paymentOptions
      existingMacBook.paymentOptions = paymentOptionsArray.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }


    // Update battery health
    if (Array.isArray(batteryHealth)) {
      existingMacBook.batteryHealth = batteryHealth.map(item => ({
        health: item.health,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    // Update cosmetic issues
    if (Array.isArray(cosmeticIssues)) {
      existingMacBook.cosmeticIssues = cosmeticIssues.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update faults
    if (Array.isArray(faults)) {
      existingMacBook.faults = faults.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update repairs
    if (Array.isArray(repairs)) {
      existingMacBook.repairs = repairs.map(item => ({
        repair: item.repair,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update front screen
    if (Array.isArray(frontScreen)) {
      existingMacBook.frontScreen = frontScreen.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update back
    if (Array.isArray(body)) {
      existingMacBook.body = body.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update accessories
    if (Array.isArray(accessories)) {
      existingMacBook.accessories = accessories.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Save updated MacBook document
    const updatedMacBook = await existingMacBook.save();

    res.json(updatedMacBook);
  } catch (error) {
    console.error('Error updating MacBook:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get all MacBooks or fetch by ID
router.get('/', async (req, res) => {
    try {
        const id = req.query.id;

        if (id) {
            console.log(`Fetching MacBook with ID: ${id}`);
            const fetchedMacBook = await MacBook.findOne({ id: id });

            if (fetchedMacBook) {
                res.json(fetchedMacBook);
            } else {
                res.status(404).json({ message: 'MacBook not found' });
            }
        } else {
            const MacBooks = await MacBook.find();
            res.json(MacBooks);
        }
    } catch (error) {
        console.error('Error fetching MacBooks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to get MacBook by modelName
router.get('/:modelName', async (req, res) => {
    try {
        const modelName = req.params.modelName;
        if (!modelName) {
            return res.status(400).json({ message: 'Model Name is required' });
        }

        const fetchedMacBook = await MacBook.findOne({ modelName });
        if (!fetchedMacBook) {
            return res.status(404).json({ message: 'MacBook not found' });
        }
        res.json(fetchedMacBook);
    } catch (error) {
        console.error('Error fetching MacBook:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to delete an iPhone by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMacBook = await MacBook.findByIdAndDelete(id);

    if (!deletedMacBook) {
      return res.status(404).json({ message: 'MacBook not found' });
    }

    res.json({ message: 'MacBook deleted successfully' });
  } catch (error) {
    console.error('Error deleting MacBook:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;