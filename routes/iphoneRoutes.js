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
router.post('/', upload.any(), async (req, res) => {
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

    // Filter battery health based on modelName
    const filterBatteryHealthOptions = (modelName) => {
      const allOptions = [
        { health: '95% or Above', deductionPercentage: 0 },
        { health: '90% or Above', deductionPercentage: 0 },
        { health: '85% or Above', deductionPercentage: 0 },
        { health: '80% or Above', deductionPercentage: 0 },
        { health: 'Less than 80%', deductionPercentage: 0 },
      ];

      if (['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15'].includes(modelName)) {
        return allOptions.filter((option) => ['95% or Above', '90% or Above', '85% or Above'].includes(option.health));
      } else if (['iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14'].includes(modelName)) {
        return allOptions.filter((option) => ['90% or Above', '85% or Above', '80% or Above'].includes(option.health));
      } else {
        return allOptions.filter((option) => ['85% or Above', '80% or Above', 'Less than 80%'].includes(option.health));
      }
    };

    // Apply the filtered battery health options based on the model name
    const batteryHealthOptions = filterBatteryHealthOptions(modelName);

    const defaultCosmeticIssues = [
      { header: 'Damaged Display', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/w5gsvgwfpkzpsx6k4an9' },
      { header: 'Damaged Back', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/mcoj9bvjccs3k3sbs0zo' },
      { header: 'Damaged Camera Lens', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/c_crop,g_auto,h_800,w_800/static/ytdbzp9swiq1ndj1ax9b.jpg' },
      { header: 'Damaged Frame', condition: 'Broken/Bent', deductionPercentage: 0, image: '' }
    ];

    const defaultFaults = [
      { header: 'Faulty Display', condition: 'Dead Pixels/Spots/Lines', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/xypgkalx2bsb4fqvtrkx' },
      { header: 'Faulty Earpiece', condition: 'No Audio/Noisy Audio', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/a0wdieodeqzxalb2xxya' },
      { header: 'Faulty Face ID', condition: 'Face ID Not Working', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/q5cdb1z1grb3vlrjiwsl' },
      { header: 'Faulty Proximity Sensor', condition: 'Display remains on during calls', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/w3ry2bfylnftkdobvarn' },
      { header: 'Faulty Vibration Motor', condition: 'No Vibration/Rattling Noise', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/hq7xci8sagfzbqapna7s' },
      { header: 'Faulty Power Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/qegdoyic1egs01excx4e' },
      { header: 'Faulty Volume Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/lfdt40jugoidunjxnjy9' },
      { header: 'Faulty Mute Switch', condition: 'Not Working/Not Switching', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/edscriyysymzpv6evh7a' },
      { header: 'Faulty Front Camera', condition: 'Dead/Blurry', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/jwlkbufksie0mytrr5t0' },
      { header: 'Faulty Rear Camera', condition: 'Dead/Blurry', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/ctbjdrjqcvunarmnvnrp' },
      { header: 'Faulty Flash', condition: 'Dead/Not Working', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/aweyxzb851kd4gvydke9' },
      { header: 'Faulty Microphone', condition: 'Not Working/Noisy', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/in2l4j5z8ibaiygm18ea' },
      { header: 'Faulty Loudspeaker', condition: 'No Audio/Noisy Audio', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/mfcoz9abwcemw8hlkoci' },
      { header: 'Faulty Charging Port', condition: 'Dead/Not Working', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/t5rehbtdmceufmpufgom' },
    ];

    const defaultRepairs = [
      { repair: 'Touch Screen Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/vdclrkhcxzopuciv3tjr' },
      { repair: 'Display Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/tfawle3cdpflyta3lnlg' },
      { repair: 'Front Camera Replaced', deductionPercentage: 0, image: '' },
      { repair: 'Back Camera Replaced', deductionPercentage: 0, image: '' },
      { repair: 'Loudspeaker Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/gf4xtvvrfag3kfy8diry' },
      { repair: 'Earpiece Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/vw9pjhxb82fk2zw0sdyo' },
      { repair: 'Microphone Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/hhs9zk7179ylqzusdi4p' },
      { repair: 'Battery Replaced', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/vqw9yzwqlchs7ils53qs' },
      { repair: 'Battery Replaced by REGEN', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/vqw9yzwqlchs7ils53qs' },
      { repair: 'Motherboard Repaired', deductionPercentage: 0, image: '' },
      { repair: 'Other Repairs', deductionPercentage: 0, image: '' }
    ];

    const defaultFrontScreen = [
      { header: 'Excellent', condition: 'Minimal Scratches', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/b5quxe8mxu91r78ezgn2' },
      { header: 'Good', condition: 'Few Scratches', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/iwwtuvg2au8briwxjk0f' },
      { header: 'Fair', condition: 'Visible Scratches', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/ry9g4aeoylpmqxmpdadx' },
      { header: 'Acceptable', condition: 'Deep Scratches', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/o7e92ahonlj1k76b1kjx' },
    ];

    const defaultBack = [
      { header: 'Excellent', condition: 'Minimal Scratches', deductionPercentage: 0, image: '' },
      { header: 'Good', condition: 'Few Scratches', deductionPercentage: 0, image: '' },
      { header: 'Fair', condition: 'Visible Scratches', deductionPercentage: 0, image: '' },
      { header: 'Acceptable', condition: 'Deep Scratches', deductionPercentage: 0, image: '' },
    ];

    const defaultSide = [
      { header: 'Excellent', condition: 'Minimal Scratches', deductionPercentage: 0, image: '' },
      { header: 'Good', condition: 'Few Scratches', deductionPercentage: 0, image: '' },
      { header: 'Fair', condition: 'Visible Scratches', deductionPercentage: 0, image: '' },
      { header: 'Acceptable', condition: 'Deep Scratches', deductionPercentage: 0, image: '' },
    ];

    const defaultSIMVariant = [
      { option: 'Dual eSIM', deductionPercentage: 0 },
      { option: 'Dual Physical SIM', deductionPercentage: 0 },
      { option: 'eSIM + Physical SIM', deductionPercentage: 0 }
    ];

    const defaultPTA = [
      { option: 'Is Your iPhone PTA Approved?', deductionPercentage: 0 },
      { option: 'Is Your iPhone Factory Unlocked?', deductionPercentage: 0 }
    ];

    const defaultAccessories = [
      { option: 'Everything (Complete Box)', deductionPercentage: 0, image: '' },
      { option: 'Box Only', deductionPercentage: 0, image: '' },
      { option: 'iPhone Only', deductionPercentage: 0, image: '' }
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
      batteryHealth: batteryHealthOptions,
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
    console.log('New iPhone with images and with filtered battery health saved to MongoDB:', newiPhone);
    return res.status(201).json(newiPhone);
  } catch (error) {
    console.error('Error adding iPhone:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});


// Update iPhone fields
router.put('/:id', upload.any(), async (req, res) => {
  try {
    const {
      modelName,
      maxPrice,
      storageSizes,
      batteryHealth,
      cosmeticIssues,
      faults,
      repairs,
      frontScreen,
      back,
      side,
      simVariant,
      pta,
      accessories,
      colors // Colors as comma-separated string
    } = req.body;

    const existingIPhone = await iPhone.findById(req.params.id);
    if (!existingIPhone) {
      return res.status(404).json({ message: 'iPhone not found' });
    }

    // Logging received body and files for debugging
    console.log('Received Body:', req.body);
    console.log('Received Files:', req.files);

    // Update basic fields
    if (modelName) existingIPhone.modelName = modelName;
    if (maxPrice) existingIPhone.maxPrice = maxPrice;

    // Handle colors and image uploads
    if (colors) {
      const colorsArray = colors.split(',');

      const updatedColors = await Promise.all(colorsArray.map(async (color) => {
        const existingColor = existingIPhone.colors.find(c => c.color === color);
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

      existingIPhone.colors = updatedColors;
    }

    // Update storage sizes (ensure storageSizes is an array)
    if (storageSizes) {
      const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
      existingIPhone.storageSizes = storageSizesArray.map(size => ({
        size: typeof size === 'object' ? size.size : size, // Handle case if size is an object
        deductionPercentage: size.deductionPercentage || 0, // Default to 0 if not provided
      }));
    }

    // Update battery health
    if (Array.isArray(batteryHealth)) {
      existingIPhone.batteryHealth = batteryHealth.map(item => ({
        health: item.health,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    // Update cosmetic issues
    if (Array.isArray(cosmeticIssues)) {
      existingIPhone.cosmeticIssues = cosmeticIssues.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update faults
    if (Array.isArray(faults)) {
      existingIPhone.faults = faults.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update repairs
    if (Array.isArray(repairs)) {
      existingIPhone.repairs = repairs.map(item => ({
        repair: item.repair,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update front screen
    if (Array.isArray(frontScreen)) {
      existingIPhone.frontScreen = frontScreen.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update back
    if (Array.isArray(back)) {
      existingIPhone.back = back.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update side
    if (Array.isArray(side)) {
      existingIPhone.side = side.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update simVariant
    if (Array.isArray(simVariant)) {
      existingIPhone.simVariant = simVariant.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    // Update PTA
    if (Array.isArray(pta)) {
      existingIPhone.pta = pta.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    // Update accessories
    if (Array.isArray(accessories)) {
      existingIPhone.accessories = accessories.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Save updated iPhone document
    const updatedIPhone = await existingIPhone.save();

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

// Route to delete an iPhone by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedIPhone = await iPhone.findByIdAndDelete(id);

    if (!deletedIPhone) {
      return res.status(404).json({ message: 'iPhone not found' });
    }

    res.json({ message: 'iPhone deleted successfully' });
  } catch (error) {
    console.error('Error deleting iPhone:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
