const Watch = require('../models/Watch');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload images to Cloudinary
const uploadToCloudinary = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        folder: 'watch_images',
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

// Route to add a new Watch
router.post('/', upload.any(), async (req, res) => {
  try {
    console.log('Received Body: ', req.body);
    console.log('Received Files: ', req.files);

    const { vendor, deviceType, modelName, maxPrice, paymentOptions, watchCaseType, watchCaseFinish, watchCaseSize } = req.body;

    const paymentOptionsArray = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
     const watchCaseFinishArray = Array.isArray(watchCaseFinish) ? watchCaseFinish : watchCaseFinish.split(',');
      const watchCaseSizesArray = Array.isArray(watchCaseSize) ? watchCaseSize : watchCaseSize.split(',');
      const watchCaseTypeArray = Array.isArray(watchCaseType) ? watchCaseType : watchCaseType.split(',');

    // Ensure each watchCaseSize is formatted properly
    const watchCaseSizeFormatted = watchCaseSizesArray.map(size => ({
      size, // Map the size directly
      deductionPercentage: 0 // Set default deductionPercentage
    }));

    // Ensure each watchCaseType is formatted properly
    const watchCaseTypeFormatted = watchCaseTypeArray.map(type => ({
      caseType: type, // Map the type directly
      deductionPercentage: 0 // Set default deductionPercentage
    }));
    
    // Handle image uploads (if any)
    let caseFinishImagesArray = [];

    if(req.files && req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        const colorName = watchCaseFinishArray[i];
        const file = req.files[i];
        const fileName = `${modelName.replace(/\s/g, '_')}_${colorName}_${uuidv4()}`;

        const imageUrl = await uploadToCloudinary(file, fileName);
        caseFinishImagesArray.push({ finish: colorName, image: imageUrl });
      }
    } else {
      caseFinishImagesArray = watchCaseFinishArray.map((finish) => ({
        finish,
        image: null,
      }));
    }


    // Default options
    // Filter battery health based on Apple Watch modelName
const filterBatteryHealthOptionsForWatches = (modelName) => {
  const allOptions = [
    { health: '95% or Above', deductionPercentage: 0 },
    { health: '90% or Above', deductionPercentage: 0 },
    { health: '85% or Above', deductionPercentage: 0 },
    { health: '80% or Above', deductionPercentage: 0 },
    { health: 'Less than 80%', deductionPercentage: 0 },
  ];

  if (['Apple Watch Ultra 2 (2023)', 'Apple Watch Series 9 (2023)', 'Apple Watch Ultra (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['95% or Above', '90% or Above', '85% or Above'].includes(option.health));
  } else if (['Apple Watch Series 7 (2021)', 'Apple Watch Series 8 (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['90% or Above', '85% or Above', '80% or Above'].includes(option.health));
  } else {
    return allOptions.filter((option) => ['85% or Above', '80% or Above', 'Less than 80%'].includes(option.health));
  }
};

// Apply the filtered battery health options based on the Watch model name
const watchBatteryHealthOptions = filterBatteryHealthOptionsForWatches(modelName);


const defaultCosmeticIssues = [
  { header: 'Damaged Display', condition: 'Front glass is cracked or shattered', deductionPercentage: 0 },
  { header: 'Damaged Body', condition: 'Watch body is cracked/bent/broken or heavily dented', deductionPercentage: 0 },
];

const defaultStrapCondition = [
      { header: 'Excellent', condition: '1 - 2 hardly visible wear and tear or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no deep wear and tear', deductionPercentage: 0},
      { header: 'Fair', condition: 'Visible signs of usage, 1 - 2 minor deep wear and tear', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Torn out, noticeable deep wear and tear', deductionPercentage: 0 },
];

const defaultBodyCondition = [
      { header: 'Excellent', condition: '1 - 2 hardly visible scratches or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no scuffs or dents', deductionPercentage: 0 },
      { header: 'Fair', condition: 'Visible scratches, 1 - 2 minor scuffs or dents', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Too many scratches, noticeable scuffs or dents', deductionPercentage: 0 },
];

const defaultFaults = [
  { header: 'Faulty Display', condition: 'Dead Pixels/Lines', deductionPercentage: 0 },
  { header: 'Faulty Side Button', condition: 'Not Working/Sticky', deductionPercentage: 0 },
  { header: 'Faulty Battery', condition: 'Drains Quickly', deductionPercentage: 0 },
  { header: 'Faulty Speaker', condition: 'No Sound/Static', deductionPercentage: 0 },
  { header: 'Faulty Microphone', condition: 'No Sound/Static', deductionPercentage: 0 },
  { header: 'Faulty Bluetooth', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty Wi-Fi', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty GPS', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty Optical Heart Sensor', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty ECG', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Compass', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Gyroscope', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Digital Crown', condition: 'Not Working', deductionPercentage: 0 },
];

const defaultRepairs = [
  { repair: 'Screen Replaced', deductionPercentage: 0 },
  { repair: 'Battery Replaced', deductionPercentage: 0 },
  { repair: 'Body Replaced', deductionPercentage: 0 },
  { repair: 'Speaker Replaced', deductionPercentage: 0 },
  { repair: 'Microphone Replaced', deductionPercentage: 0 },
  { repair: 'Bluetooth Replaced', deductionPercentage: 0 },
  { repair: 'Wi-Fi Replaced', deductionPercentage: 0 },
  { repair: 'Other Repairs', deductionPercentage: 0 }
];

const defaultAccessories = [
  { option: 'Everything (Complete Box)', deductionPercentage: 0 },
  { option: 'Box Only', deductionPercentage: 0 },
  { option: 'Watch Only', deductionPercentage: 0 },
];

const defaultBandsType = [
  { option: 'Original Band', deductionPercentage: 0 },
  { option: 'Aftermarket Band', deductionPercentage: 0 },
];


    const newWatch = new Watch({
      id: uuidv4(),
      vendor,
      deviceType,
      modelName,
      maxPrice,
      paymentOptions: paymentOptionsArray,
      watchCaseType: watchCaseTypeFormatted,
      watchCaseFinish: caseFinishImagesArray,
      watchCaseSize: watchCaseSizeFormatted,
      strapCondition: defaultStrapCondition,
      cosmeticIssues: defaultCosmeticIssues,
      batteryHealth: watchBatteryHealthOptions,
      bandsType: defaultBandsType,
      faults: defaultFaults,
      repairs: defaultRepairs,
      bodyCondition: defaultBodyCondition,
      accessories: defaultAccessories,
    });

    await newWatch.save();
    res.status(201).json(newWatch);
  } catch (error) {
    console.error('Error adding Watch:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to update a Watch by ID
router.put('/:id/device-management', upload.any(), async (req, res) => {
  try {
    const {
      vendor,
      deviceType,
      modelName,
      maxPrice,
      paymentOptions,
      watchCaseType,
      watchCaseFinish,
      watchCaseSize,
      bandsType,
      batteryHealth,
      cosmeticIssues,
      strapCondition,
      faults,
      repairs,
      bodyCondition,
      accessories
    } = req.body;

    const existingWatch = await Watch.findById(req.params.id);
    if (!existingWatch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    //Logging received body and files
    console.log('Received Body: ', req.body);
    console.log('Received Files: ', req.files);

        // Filter battery health based on Apple Watch modelName
const filterBatteryHealthOptionsForWatches = (modelName) => {
  const allOptions = [
    { health: '95% or Above', deductionPercentage: 0 },
    { health: '90% or Above', deductionPercentage: 0 },
    { health: '85% or Above', deductionPercentage: 0 },
    { health: '80% or Above', deductionPercentage: 0 },
    { health: 'Less than 80%', deductionPercentage: 0 },
  ];

  if (['Apple Watch Ultra 2 (2023)', 'Apple Watch Series 9 (2023)', 'Apple Watch Ultra (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['95% or Above', '90% or Above', '85% or Above'].includes(option.health));
  } else if (['Apple Watch Series 7 (2021)', 'Apple Watch Series 8 (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['90% or Above', '85% or Above', '80% or Above'].includes(option.health));
  } else {
    return allOptions.filter((option) => ['85% or Above', '80% or Above', 'Less than 80%'].includes(option.health));
  }
};

// Apply the filtered battery health options based on the Watch model name
const watchBatteryHealthOptions = filterBatteryHealthOptionsForWatches(modelName);


const defaultCosmeticIssues = [
  { header: 'Damaged Display', condition: 'Front glass is cracked or shattered', deductionPercentage: 0 },
  { header: 'Damaged Body', condition: 'Watch body is cracked/bent/broken or heavily dented', deductionPercentage: 0 },
];

const defaultStrapCondition = [
      { header: 'Excellent', condition: '1 - 2 hardly visible wear and tear or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no deep wear and tear', deductionPercentage: 0},
      { header: 'Fair', condition: 'Visible signs of usage, 1 - 2 minor deep wear and tear', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Torn out, noticeable deep wear and tear', deductionPercentage: 0 },
];

const defaultBodyCondition = [
      { header: 'Excellent', condition: '1 - 2 hardly visible scratches or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no scuffs or dents', deductionPercentage: 0 },
      { header: 'Fair', condition: 'Visible scratches, 1 - 2 minor scuffs or dents', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Too many scratches, noticeable scuffs or dents', deductionPercentage: 0 },
];

const defaultFaults = [
  { header: 'Faulty Display', condition: 'Dead Pixels/Lines', deductionPercentage: 0 },
  { header: 'Faulty Side Button', condition: 'Not Working/Sticky', deductionPercentage: 0 },
  { header: 'Faulty Battery', condition: 'Drains Quickly', deductionPercentage: 0 },
  { header: 'Faulty Speaker', condition: 'No Sound/Static', deductionPercentage: 0 },
  { header: 'Faulty Microphone', condition: 'No Sound/Static', deductionPercentage: 0 },
  { header: 'Faulty Bluetooth', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty Wi-Fi', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty GPS', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty Optical Heart Sensor', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty ECG', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Compass', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Gyroscope', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Digital Crown', condition: 'Not Working', deductionPercentage: 0 },
];

const defaultRepairs = [
  { repair: 'Screen Replaced', deductionPercentage: 0 },
  { repair: 'Battery Replaced', deductionPercentage: 0 },
  { repair: 'Body Replaced', deductionPercentage: 0 },
  { repair: 'Speaker Replaced', deductionPercentage: 0 },
  { repair: 'Microphone Replaced', deductionPercentage: 0 },
  { repair: 'Bluetooth Replaced', deductionPercentage: 0 },
  { repair: 'Wi-Fi Replaced', deductionPercentage: 0 },
  { repair: 'Other Repairs', deductionPercentage: 0 }
];

const defaultAccessories = [
  { option: 'Everything (Complete Box)', deductionPercentage: 0 },
  { option: 'Box Only', deductionPercentage: 0 },
  { option: 'Watch Only', deductionPercentage: 0 },
];

const defaultBandsType = [
  { option: 'Original Band', deductionPercentage: 0 },
  { option: 'Aftermarket Band', deductionPercentage: 0 },
];

    // Update basic fields
    if (vendor) existingWatch.vendor = vendor;
    if (deviceType) existingWatch.deviceType = deviceType;
    if (modelName) existingWatch.modelName = modelName;
    if (maxPrice) existingWatch.maxPrice = maxPrice;

            const updateDeductionsIfZero = (existing, incoming, defaults) => {
      // If incoming data is missing, use defaults
      if (!incoming || !Array.isArray(incoming)) return defaults;

      // If the incoming data exists, but is missing key fields (like header/condition), replace them
      return incoming.map((item, index) => {
        const defaultItem = defaults[index] || {};
        return {
          ...defaultItem, // Use defaults as base
          ...item, // Override with incoming data if exists
          deductionPercentage: item.deductionPercentage || (existing[index]?.deductionPercentage || 0),
        };
      });
    };

    // Handle payment options
    if (paymentOptions) {
      const paymentOptionsArray = Array.isArray(paymentOptions)
        ? paymentOptions
        : JSON.parse(paymentOptions || '[]');
      existingWatch.paymentOptions = paymentOptionsArray.map(option => ({
        option: option.option,
        deductionPercentage: option.deductionPercentage || 0
      }));
    }

    // Handle watch case type
    if (watchCaseType) {
      const watchCaseTypeArray = Array.isArray(watchCaseType)
        ? watchCaseType
        : typeof watchCaseType === 'string'
        ? [watchCaseType]
        : JSON.parse(watchCaseType);
      existingWatch.watchCaseType = watchCaseTypeArray.map(type => ({
        caseType: type.caseType || type,
        deductionPercentage: type.deductionPercentage || 0
      }));
    }

    // Handle image uploads for watch case finish
    if (watchCaseFinish) {
      const watchCaseFinishArray = watchCaseFinish.split(',');

      const updatedCaseFinishImages = await Promise.all(watchCaseFinishArray.map(async (finish) => {
        const existingFinish = existingWatch.watchCaseFinish.find(c => c.finish === finish);
        const uploadedImage = req.files.find(file => file.fieldname === `images_${finish}`);

        console.log(`Processing Finish: ${finish}, existingFinish: ${existingFinish ? existingFinish.finish : 'N/A'}`);

        let imageUrl = existingFinish?.image;

        if (uploadedImage) {
          console.log(`Uploading image for finish: ${finish}`);
          const fileName = `${modelName.replace(/\s/g, '_')}_${finish}_${uuidv4()}`;
          imageUrl = await uploadToCloudinary(uploadedImage, fileName);
          console.log(`Uploaded image for finish: ${finish}`);
        }
        return { finish, image: imageUrl };
      }))
      existingWatch.watchCaseFinish = updatedCaseFinishImages;
    }

    // Handle watch case size
    if (watchCaseSize) {
      const watchCaseSizesArray = Array.isArray(watchCaseSize) ? watchCaseSize : watchCaseSize.split(',');
      existingWatch.watchCaseSize = watchCaseSizesArray.map(size => ({
        size: typeof size === 'object' ? size.size :size,
        deductionPercentage: size.deductionPercentage || 0,
      }));
    }

    // Update bands type
        if (bandsType) {
      const bandsTypeArray = Array.isArray(bandsType)
        ? bandsType
        : typeof bandsType === 'string'
        ? [bandsType]
        : JSON.parse(bandsType);
      existingWatch.bandsType = bandsTypeArray.map(type => ({
        option: type.option || type,
        deductionPercentage: type.deductionPercentage || 0
      }));
    }

    // Update battery health
    if (batteryHealth) {
      existingWatch.batteryHealth = batteryHealth.map(health => ({
        health: health.health || health,
        deductionPercentage: health.deductionPercentage || 0
      }));
    }

    // Update cosmetic issues
    if (cosmeticIssues) {
      existingWatch.cosmeticIssues = cosmeticIssues.map(issue => ({
        header: issue.header || issue,
        condition: issue.condition || '',
        deductionPercentage: issue.deductionPercentage || 0,
        image: issue.image || ''
      }));
    }

    // Update strap condition
    if (strapCondition) {
      existingWatch.strapCondition = strapCondition.map(strap => ({
        header: strap.header || strap,
        condition: strap.condition || '',
        deductionPercentage: strap.deductionPercentage || 0,
        image: strap.image || ''
      }));
    }

    // Update faults
    if (faults) {
      existingWatch.faults = faults.map(fault => ({
        header: fault.header || fault,
        condition: fault.condition || '',
        deductionPercentage: fault.deductionPercentage || 0,
        image: fault.image || ''
      }));
    }

    // Update repairs
    if (repairs) {
      existingWatch.repairs = repairs.map(repair => ({
        repair: repair.repair || repair,
        deductionPercentage: repair.deductionPercentage || 0,
        image: repair.image || ''
      }));
    }

    // Update body condition
    if (bodyCondition) {
      existingWatch.bodyCondition = bodyCondition.map(body => ({
        header: body.header || body,
        condition: body.condition || '',
        deductionPercentage: body.deductionPercentage || 0,
        image: body.image || ''
      }));
    }

    // Update accessories
    if (accessories) {
      existingWatch.accessories = accessories.map(accessory => ({
        option: accessory.option || accessory,
        deductionPercentage: accessory.deductionPercentage || 0,
        image: accessory.image || ''
      }));
    }

    existingWatch.batteryHealth = updateDeductionsIfZero(existingWatch.batteryHealth, batteryHealth, watchBatteryHealthOptions);
    existingWatch.cosmeticIssues = updateDeductionsIfZero(existingWatch.cosmeticIssues, cosmeticIssues, defaultCosmeticIssues);
    existingWatch.strapCondition = updateDeductionsIfZero(existingWatch.strapCondition, strapCondition, defaultStrapCondition);
    existingWatch.faults = updateDeductionsIfZero(existingWatch.faults, faults, defaultFaults);
    existingWatch.repairs = updateDeductionsIfZero(existingWatch.repairs, repairs, defaultRepairs);
    existingWatch.bodyCondition = updateDeductionsIfZero(existingWatch.bodyCondition, bodyCondition, defaultBodyCondition);
    existingWatch.accessories = updateDeductionsIfZero(existingWatch.accessories, accessories, defaultAccessories);
    existingWatch.bandsType = updateDeductionsIfZero(existingWatch.bandsType, bandsType, defaultBandsType);

    // Save the updated Watch document
    const updatedWatch = await existingWatch.save();
    res.json(updatedWatch);
  } catch (error) {
    console.error('Error updating Watch:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id/device-details', upload.any(), async (req, res) => {
  try {
    const {
      vendor,
      deviceType,
      modelName,
      maxPrice,
      paymentOptions,
      watchCaseType,
      watchCaseFinish,
      watchCaseSize,
      bandsType,
      batteryHealth,
      cosmeticIssues,
      strapCondition,
      faults,
      repairs,
      bodyCondition,
      accessories
    } = req.body;

    const existingWatch = await Watch.findById(req.params.id);
    if (!existingWatch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    //Logging received body and files
    console.log('Received Body: ', req.body);
    console.log('Received Files: ', req.files);

        // Filter battery health based on Apple Watch modelName
const filterBatteryHealthOptionsForWatches = (modelName) => {
  const allOptions = [
    { health: '95% or Above', deductionPercentage: 0 },
    { health: '90% or Above', deductionPercentage: 0 },
    { health: '85% or Above', deductionPercentage: 0 },
    { health: '80% or Above', deductionPercentage: 0 },
    { health: 'Less than 80%', deductionPercentage: 0 },
  ];

  if (['Apple Watch Ultra 2 (2023)', 'Apple Watch Series 9 (2023)', 'Apple Watch Ultra (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['95% or Above', '90% or Above', '85% or Above'].includes(option.health));
  } else if (['Apple Watch Series 7 (2021)', 'Apple Watch Series 8 (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['90% or Above', '85% or Above', '80% or Above'].includes(option.health));
  } else {
    return allOptions.filter((option) => ['85% or Above', '80% or Above', 'Less than 80%'].includes(option.health));
  }
};

// Apply the filtered battery health options based on the Watch model name
const watchBatteryHealthOptions = filterBatteryHealthOptionsForWatches(modelName);


const defaultCosmeticIssues = [
  { header: 'Damaged Display', condition: 'Front glass is cracked or shattered', deductionPercentage: 0 },
  { header: 'Damaged Body', condition: 'Watch body is cracked/bent/broken or heavily dented', deductionPercentage: 0 },
];

const defaultStrapCondition = [
      { header: 'Excellent', condition: '1 - 2 hardly visible wear and tear or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no deep wear and tear', deductionPercentage: 0},
      { header: 'Fair', condition: 'Visible signs of usage, 1 - 2 minor deep wear and tear', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Torn out, noticeable deep wear and tear', deductionPercentage: 0 },
];

const defaultBodyCondition = [
      { header: 'Excellent', condition: '1 - 2 hardly visible scratches or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no scuffs or dents', deductionPercentage: 0 },
      { header: 'Fair', condition: 'Visible scratches, 1 - 2 minor scuffs or dents', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Too many scratches, noticeable scuffs or dents', deductionPercentage: 0 },
];

const defaultFaults = [
  { header: 'Faulty Display', condition: 'Dead Pixels/Lines', deductionPercentage: 0 },
  { header: 'Faulty Side Button', condition: 'Not Working/Sticky', deductionPercentage: 0 },
  { header: 'Faulty Battery', condition: 'Drains Quickly', deductionPercentage: 0 },
  { header: 'Faulty Speaker', condition: 'No Sound/Static', deductionPercentage: 0 },
  { header: 'Faulty Microphone', condition: 'No Sound/Static', deductionPercentage: 0 },
  { header: 'Faulty Bluetooth', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty Wi-Fi', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty GPS', condition: 'Not Connecting', deductionPercentage: 0 },
  { header: 'Faulty Optical Heart Sensor', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty ECG', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Compass', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Gyroscope', condition: 'Not Working', deductionPercentage: 0 },
  { header: 'Faulty Digital Crown', condition: 'Not Working', deductionPercentage: 0 },
];

const defaultRepairs = [
  { repair: 'Screen Replaced', deductionPercentage: 0 },
  { repair: 'Battery Replaced', deductionPercentage: 0 },
  { repair: 'Body Replaced', deductionPercentage: 0 },
  { repair: 'Speaker Replaced', deductionPercentage: 0 },
  { repair: 'Microphone Replaced', deductionPercentage: 0 },
  { repair: 'Bluetooth Replaced', deductionPercentage: 0 },
  { repair: 'Wi-Fi Replaced', deductionPercentage: 0 },
  { repair: 'Other Repairs', deductionPercentage: 0 }
];

const defaultAccessories = [
  { option: 'Everything (Complete Box)', deductionPercentage: 0 },
  { option: 'Box Only', deductionPercentage: 0 },
  { option: 'Watch Only', deductionPercentage: 0 },
];

const defaultBandsType = [
  { option: 'Original Band', deductionPercentage: 0 },
  { option: 'Aftermarket Band', deductionPercentage: 0 },
];

    // Update basic fields
    if (vendor) existingWatch.vendor = vendor;
    if (deviceType) existingWatch.deviceType = deviceType;
    if (modelName) existingWatch.modelName = modelName;
    if (maxPrice) existingWatch.maxPrice = maxPrice;

    const updateDeductionsIfZero = (existing = [], incoming = [], defaults = []) => {
  if (!incoming || !Array.isArray(incoming) || incoming.length === 0) {
    // Return existing if available, otherwise use defaults
    return existing.length > 0 ? existing : defaults;
  }

  return incoming.map((item, index) => {
    const defaultItem = defaults[index] || {}; // Use defaults if no incoming or existing
    const existingItem = existing[index] || {}; // Use existing data if available

    return {
      ...defaultItem,  // Default as base
      ...existingItem,  // Preserve existing data
      ...item,  // Override with incoming data
      deductionPercentage: item.deductionPercentage !== undefined 
        ? item.deductionPercentage 
        : (existingItem.deductionPercentage !== undefined
          ? existingItem.deductionPercentage
          : defaultItem.deductionPercentage || 0)  // Fallback to default or zero
    };
  });
};

    // Handle payment options
    if (paymentOptions) {
      const paymentOptionsArray = Array.isArray(paymentOptions)
        ? paymentOptions
        : JSON.parse(paymentOptions || '[]');
      existingWatch.paymentOptions = paymentOptionsArray.map(option => ({
        option: option.option,
        deductionPercentage: option.deductionPercentage || 0
      }));
    }

    // Handle watch case type
    if (watchCaseType) {
      const watchCaseTypeArray = Array.isArray(watchCaseType)
        ? watchCaseType
        : typeof watchCaseType === 'string'
        ? [watchCaseType]
        : JSON.parse(watchCaseType);
      existingWatch.watchCaseType = watchCaseTypeArray.map(type => ({
        caseType: type.caseType || type,
        deductionPercentage: type.deductionPercentage || 0
      }));
    }

    // Handle image uploads for watch case finish
    if (watchCaseFinish) {
      const watchCaseFinishArray = watchCaseFinish.split(',');

      const updatedCaseFinishImages = await Promise.all(watchCaseFinishArray.map(async (finish) => {
        const existingFinish = existingWatch.watchCaseFinish.find(c => c.finish === finish);
        const uploadedImage = req.files.find(file => file.feildname === `images_${finish}`);

        console.log(`Processing Finish: ${finish}, existingFinish: ${existingFinish ? existingFinish.finish : 'N/A'}`);

        let imageUrl = existingFinish?.image;

        if (uploadedImage) {
          console.log(`Uploading image for finish: ${finish}`);
          const fileName = `${modelName.replace(/\s/g, '_')}_${finish}_${uuidv4()}`;
          imageUrl = await uploadToCloudinary(uploadedImage, fileName);
          console.log(`Uploaded image for finish: ${finish}`);
        }
        return { finish, image: imageUrl };
      }))
      existingWatch.watchCaseFinish = updatedCaseFinishImages;
    }

    // Handle watch case size
    if (watchCaseSize) {
      const watchCaseSizesArray = Array.isArray(watchCaseSize) ? watchCaseSize : watchCaseSize.split(',');
      existingWatch.watchCaseSize = watchCaseSizesArray.map(size => ({
        size: typeof size === 'object' ? size.size :size,
        deductionPercentage: size.deductionPercentage || 0,
      }));
    }

    // Update bands type
        if (bandsType) {
      const bandsTypeArray = Array.isArray(bandsType)
        ? bandsType
        : typeof bandsType === 'string'
        ? [bandsType]
        : JSON.parse(bandsType);
      existingWatch.bandsType = bandsTypeArray.map(type => ({
        option: type.option || type,
        deductionPercentage: type.deductionPercentage || 0
      }));
    }

    // Update battery health
    if (batteryHealth) {
      existingWatch.batteryHealth = batteryHealth.map(health => ({
        health: health.health || health,
        deductionPercentage: health.deductionPercentage || 0
      }));
    }

    // Update cosmetic issues
    if (cosmeticIssues) {
      existingWatch.cosmeticIssues = cosmeticIssues.map(issue => ({
        header: issue.header || issue,
        condition: issue.condition || '',
        deductionPercentage: issue.deductionPercentage || 0,
        image: issue.image || ''
      }));
    }

    // Update strap condition
    if (strapCondition) {
      existingWatch.strapCondition = strapCondition.map(strap => ({
        header: strap.header || strap,
        condition: strap.condition || '',
        deductionPercentage: strap.deductionPercentage || 0,
        image: strap.image || ''
      }));
    }

    // Update faults
    if (faults) {
      existingWatch.faults = faults.map(fault => ({
        header: fault.header || fault,
        condition: fault.condition || '',
        deductionPercentage: fault.deductionPercentage || 0,
        image: fault.image || ''
      }));
    }

    // Update repairs
    if (repairs) {
      existingWatch.repairs = repairs.map(repair => ({
        repair: repair.repair || repair,
        deductionPercentage: repair.deductionPercentage || 0,
        image: repair.image || ''
      }));
    }

    // Update body condition
    if (bodyCondition) {
      existingWatch.bodyCondition = bodyCondition.map(body => ({
        header: body.header || body,
        condition: body.condition || '',
        deductionPercentage: body.deductionPercentage || 0,
        image: body.image || ''
      }));
    }

    // Update accessories
    if (accessories) {
      existingWatch.accessories = accessories.map(accessory => ({
        option: accessory.option || accessory,
        deductionPercentage: accessory.deductionPercentage || 0,
        image: accessory.image || ''
      }));
    }

    existingWatch.batteryHealth = updateDeductionsIfZero(existingWatch.batteryHealth, batteryHealth, watchBatteryHealthOptions);
    existingWatch.cosmeticIssues = updateDeductionsIfZero(existingWatch.cosmeticIssues, cosmeticIssues, defaultCosmeticIssues);
    existingWatch.strapCondition = updateDeductionsIfZero(existingWatch.strapCondition, strapCondition, defaultStrapCondition);
    existingWatch.faults = updateDeductionsIfZero(existingWatch.faults, faults, defaultFaults);
    existingWatch.repairs = updateDeductionsIfZero(existingWatch.repairs, repairs, defaultRepairs);
    existingWatch.bodyCondition = updateDeductionsIfZero(existingWatch.bodyCondition, bodyCondition, defaultBodyCondition);
    existingWatch.accessories = updateDeductionsIfZero(existingWatch.accessories, accessories, defaultAccessories);
    existingWatch.bandsType = updateDeductionsIfZero(existingWatch.bandsType, bandsType, defaultBandsType);

    // Save the updated Watch document
    const updatedWatch = await existingWatch.save();
    res.json(updatedWatch);
  } catch (error) {
    console.error('Error updating Watch:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get all Watches or fetch by ID
router.get('/', async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      const fetchedWatch = await Watch.findOne({ id: id });
      if (fetchedWatch) {
        res.json(fetchedWatch);
      } else {
        res.status(404).json({ message: 'Watch not found' });
      }
    } else {
      const watches = await Watch.find();
      res.json(watches);
    }
  } catch (error) {
    console.error('Error retrieving Watch:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get Watch by model name
router.get('/:modelName', async (req, res) => {
  try {
    const modelName = req.params.modelName;
    const fetchedWatch = await Watch.findOne({ modelName });
    if (fetchedWatch) {
      res.json(fetchedWatch);
    } else {
      res.status(404).json({ message: 'Watch not found' });
    }
  } catch (error) {
    console.error('Error retrieving Watch:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to delete a Watch by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedWatch = await Watch.findByIdAndDelete(id);
    if (!deletedWatch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json({ message: 'Watch deleted successfully' });
  } catch (error) {
    console.error('Error deleting Watch:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
