const iPad = require('../models/iPad');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = (file, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                public_id: fileName,
                folder: 'ipad_images',
            },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve(result.secure_url);
            }
        );
        stream.end(file.buffer);
    });
};

router.post('/', upload.any(), async (req, res) => {
    try {
        console.log('Received Body: ', req.body)
        console.log('Received Files: ', req.files)

        const {vendor, deviceType, modelName, maxPrice, colors, storageSizes, paymentOptions } = req.body;

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


    // Filter battery health based on iPad modelName
const filterBatteryHealthOptionsForiPads = (modelName) => {
  const allOptions = [
    { health: '95% or Above', deductionPercentage: 0 },
    { health: '90% or Above', deductionPercentage: 0 },
    { health: '85% or Above', deductionPercentage: 0 },
    { health: '80% or Above', deductionPercentage: 0 },
    { health: 'Less than 80%', deductionPercentage: 0 },
  ];

  if (['iPad - 10th Generation (2022)', 'iPad Air - 5th Generation (2022)', 'iPad Pro 11-inch - 4th Generation (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['95% or Above', '90% or Above', '85% or Above'].includes(option.health));
  } else if (['iPad - 9th Generation (2021)', 'iPad mini - 6th Generation (2021)', 'iPad Pro 12.9-inch - 5th Generation (2021)'].includes(modelName)) {
    return allOptions.filter((option) => ['90% or Above', '85% or Above', '80% or Above'].includes(option.health));
  } else {
    return allOptions.filter((option) => ['85% or Above', '80% or Above', 'Less than 80%'].includes(option.health));
  }
};

// Apply the filtered battery health options based on the iPad model name
const iPadBatteryHealthOptions = filterBatteryHealthOptionsForiPads(modelName);


    const defaultCosmeticIssues = [
      { header: 'Damaged Display', condition: 'Front glass is cracked or shattered', deductionPercentage: 0 },
      { header: 'Damaged Body', condition: 'Body is bent/broken or heavily dented', deductionPercentage: 0 },
      { header: 'Damaged Camera Lens', condition: 'Camera lens is cracked or shattered', deductionPercentage: 0 },
    ];

    const paymentOptionsArray = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
    console.log('Payment Options Array: ', paymentOptionsArray);

    // Function to filter out Faulty Face ID based on the model name
const filterFaultsForiPads = (modelName) => {
  const allFaults = [
      { header: 'Faulty Display', condition: 'Dead Pixels/Spots/Lines', deductionPercentage: 0},
      { header: 'Faulty Face ID', condition: 'Face ID is not working or not working consistently', deductionPercentage: 0 },
      { header: 'Faulty Vibration Motor', condition: 'No Vibration/Rattling Noise', deductionPercentage: 0 },
      { header: 'Faulty Power Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0 },
      { header: 'Faulty Volume Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0 },
      { header: 'Faulty Mute Switch', condition: 'Not Working/Not Switching', deductionPercentage: 0 },
      { header: 'Faulty Front Camera', condition: 'Front Camera does not work, or the image is blurry', deductionPercentage: 0 },
      { header: 'Faulty Rear Camera', condition: 'Rear Camera does not work, or the image is blurry', deductionPercentage: 0 },
      { header: 'Faulty Flash', condition: 'Dead/Not Working', deductionPercentage: 0 },
      { header: 'Faulty Microphone', condition: 'Not Working/Noisy', deductionPercentage: 0 },
      { header: 'Faulty Loudspeaker', condition: 'No Audio/Noisy Audio', deductionPercentage: 0 },
      { header: 'Faulty Charging Port', condition: 'Dead/Not Working', deductionPercentage: 0 },
  ];

  // Exclude Faulty Face ID for certain iPad models
  if (['iPad - 9th Generation (2021)',
    'iPad mini - 6th Generation (2021)',
    'iPad Pro 12.9-inch - 5th Generation (2021)',
    'iPad Air - 5th Generation (2022)'].includes(modelName)) {
    return allFaults.filter((fault) => fault.header !== 'Faulty Face ID');
  }

  // Return all faults if the model is not in the list
  return allFaults;
};

// Apply the filtered faults based on the iPad model name
const iPadFaultsOptions = filterFaultsForiPads(modelName);


    const defaultRepairs = [
      { repair: 'Touch Screen Replaced', deductionPercentage: 0 },
      { repair: 'Display Replaced', deductionPercentage: 0 },
      { repair: 'Front Camera Replaced', deductionPercentage: 0 },
      { repair: 'Back Camera Replaced', deductionPercentage: 0 },
      { repair: 'Loudspeaker Replaced', deductionPercentage: 0 },
      { repair: 'Earpiece Replaced', deductionPercentage: 0 },
      { repair: 'Microphone Replaced', deductionPercentage: 0 },
      { repair: 'Battery Replaced', deductionPercentage: 0 },
      { repair: 'Battery Replaced by REGEN', deductionPercentage: 0 },
      { repair: 'Motherboard Repaired', deductionPercentage: 0 },
      { repair: 'Other Repairs', deductionPercentage: 0 }
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
      { option: 'iPad Only', deductionPercentage: 0, image: '' }
    ];

    const defaultApplePencil = [
    { generation: '1st Generation', header: 'Excellent', condition: 'Almost like new with no visible signs of wear.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Good', condition: 'Some minor signs of use such as small scratches.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Fair', condition: 'Visible signs of use with noticeable scratches or marks.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Acceptable', condition: 'Heavily used with clear signs of wear, possibly with functional defects.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Excellent', condition: 'Almost like new with no visible signs of wear.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Good', condition: 'Some minor signs of use such as small scratches.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Fair', condition: 'Visible signs of use with noticeable scratches or marks.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Acceptable', condition: 'Heavily used with clear signs of wear, possibly with functional defects.', deductionPercentage: 0 }
];

    const defaultConnectivity = [
        { option: 'WiFi + Cellular', deductionPercentage: 0 },
        { option: 'WiFi Only', deductionPercentage: 0 },
    ];

    const defaultPTA = [
      { option: 'Is Your iPad PTA Approved?', deductionPercentage: 0 },
      { option: 'Is Your iPad Factory Unlocked?', deductionPercentage: 0 }
    ];

    const newiPad = new iPad({
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
        paymentOptions: paymentOptionsArray,
        batteryHealth: iPadBatteryHealthOptions,
        cosmeticIssues: defaultCosmeticIssues,
        faults: iPadFaultsOptions,
        repairs: defaultRepairs,
        frontScreen: defaultFrontScreen,
        body: defaultBody,
        accessories: defaultAccessories,
        applePencil: defaultApplePencil,
        connectivity: defaultConnectivity,
        pta: defaultPTA
    });

    await newiPad.save();
    console.log('New iPad Created: ', newiPad);
    return res.status(201).json(newiPad);
    } catch (error) {
        console.error('Error in creating new iPad: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update iPad fields
router.put('/:id/device-management', upload.any(), async(req, res) => {
    try {
        const {
            vendor,
            deviceType,
            modelName,
            maxPrice,
            colors,
            storageSizes,
            paymentOptions,
            batteryHealth,
            cosmeticIssues,
            faults,
            repairs,
            frontScreen,
            body,
            accessories,
            pta,
            applePencil,
            connectivity,
        } = req.body;

        const existingIPad = await iPad.findById(req.params.id);
        if (!existingIPad) {
            return res.status(404).json({ error: 'iPad not found' });
        }

        console.log('Received Body: ', req.body);
        console.log('Received Files: ', req.files);

        const filterBatteryHealthOptionsForiPads = (modelName) => {
  const allOptions = [
    { health: '95% or Above', deductionPercentage: 0 },
    { health: '90% or Above', deductionPercentage: 0 },
    { health: '85% or Above', deductionPercentage: 0 },
    { health: '80% or Above', deductionPercentage: 0 },
    { health: 'Less than 80%', deductionPercentage: 0 },
  ];

  if (['iPad - 10th Generation (2022)', 'iPad Air - 5th Generation (2022)', 'iPad Pro 11-inch - 4th Generation (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['95% or Above', '90% or Above', '85% or Above'].includes(option.health));
  } else if (['iPad - 9th Generation (2021)', 'iPad mini - 6th Generation (2021)', 'iPad Pro 12.9-inch - 5th Generation (2021)'].includes(modelName)) {
    return allOptions.filter((option) => ['90% or Above', '85% or Above', '80% or Above'].includes(option.health));
  } else {
    return allOptions.filter((option) => ['85% or Above', '80% or Above', 'Less than 80%'].includes(option.health));
  }
};

// Apply the filtered battery health options based on the iPad model name
const iPadBatteryHealthOptions = filterBatteryHealthOptionsForiPads(modelName);


    const defaultCosmeticIssues = [
      { header: 'Damaged Display', condition: 'Front glass is cracked or shattered', deductionPercentage: 0 },
      { header: 'Damaged Body', condition: 'Body is bent/broken or heavily dented', deductionPercentage: 0 },
      { header: 'Damaged Camera Lens', condition: 'Camera lens is cracked or shattered', deductionPercentage: 0 },
    ];

    const paymentOptionsArray = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
    console.log('Payment Options Array: ', paymentOptionsArray);

    // Function to filter out Faulty Face ID based on the model name
const filterFaultsForiPads = (modelName) => {
  const allFaults = [
      { header: 'Faulty Display', condition: 'Dead Pixels/Spots/Lines', deductionPercentage: 0},
      { header: 'Faulty Earpiece', condition: 'No Audio/Noisy Audio during phone calls', deductionPercentage: 0 },
      { header: 'Faulty Face ID', condition: 'Face ID is not working or not working consistently', deductionPercentage: 0 },
      { header: 'Faulty Proximity Sensor', condition: 'Display remains on during calls', deductionPercentage: 0 },
      { header: 'Faulty Vibration Motor', condition: 'No Vibration/Rattling Noise', deductionPercentage: 0 },
      { header: 'Faulty Power Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0 },
      { header: 'Faulty Volume Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0 },
      { header: 'Faulty Mute Switch', condition: 'Not Working/Not Switching', deductionPercentage: 0 },
      { header: 'Faulty Front Camera', condition: 'Front Camera does not work, or the image is blurry', deductionPercentage: 0 },
      { header: 'Faulty Rear Camera', condition: 'Rear Camera does not work, or the image is blurry', deductionPercentage: 0 },
      { header: 'Faulty Flash', condition: 'Dead/Not Working', deductionPercentage: 0 },
      { header: 'Faulty Microphone', condition: 'Not Working/Noisy', deductionPercentage: 0 },
      { header: 'Faulty Loudspeaker', condition: 'No Audio/Noisy Audio', deductionPercentage: 0 },
      { header: 'Faulty Charging Port', condition: 'Dead/Not Working', deductionPercentage: 0 },
  ];

  // Exclude Faulty Face ID for certain iPad models
  if (['iPad - 9th Generation (2021)',
    'iPad mini - 6th Generation (2021)',
    'iPad Pro 12.9-inch - 5th Generation (2021)',
    'iPad Air - 5th Generation (2022)'].includes(modelName)) {
    return allFaults.filter((fault) => fault.header !== 'Faulty Face ID');
  }

  // Return all faults if the model is not in the list
  return allFaults;
};

// Apply the filtered faults based on the iPad model name
const iPadFaultsOptions = filterFaultsForiPads(modelName);


    const defaultRepairs = [
      { repair: 'Touch Screen Replaced', deductionPercentage: 0 },
      { repair: 'Display Replaced', deductionPercentage: 0 },
      { repair: 'Front Camera Replaced', deductionPercentage: 0 },
      { repair: 'Back Camera Replaced', deductionPercentage: 0 },
      { repair: 'Loudspeaker Replaced', deductionPercentage: 0 },
      { repair: 'Earpiece Replaced', deductionPercentage: 0 },
      { repair: 'Microphone Replaced', deductionPercentage: 0 },
      { repair: 'Battery Replaced', deductionPercentage: 0 },
      { repair: 'Battery Replaced by REGEN', deductionPercentage: 0 },
      { repair: 'Motherboard Repaired', deductionPercentage: 0 },
      { repair: 'Other Repairs', deductionPercentage: 0 }
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
      { option: 'iPad Only', deductionPercentage: 0, image: '' }
    ];

const defaultApplePencil = [
    { generation: '1st Generation', header: 'Excellent', condition: 'Almost like new with no visible signs of wear.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Good', condition: 'Some minor signs of use such as small scratches.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Fair', condition: 'Visible signs of use with noticeable scratches or marks.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Acceptable', condition: 'Heavily used with clear signs of wear, possibly with functional defects.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Excellent', condition: 'Almost like new with no visible signs of wear.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Good', condition: 'Some minor signs of use such as small scratches.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Fair', condition: 'Visible signs of use with noticeable scratches or marks.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Acceptable', condition: 'Heavily used with clear signs of wear, possibly with functional defects.', deductionPercentage: 0 }
];


    const defaultConnectivity = [
        { option: 'WiFi + Cellular', deductionPercentage: 0 },
        { option: 'WiFi Only', deductionPercentage: 0 },
    ];

    const defaultPTA = [
      { option: 'Is Your iPad PTA Approved?', deductionPercentage: 0 },
      { option: 'Is Your iPad Factory Unlocked?', deductionPercentage: 0 }
    ];

        if (vendor) existingIPad.vendor = vendor;
        if (deviceType) existingIPad.deviceType = deviceType;
        if (modelName) existingIPad.modelName = modelName;
        if (maxPrice) existingIPad.maxPrice = maxPrice;

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

        if (colors) {
            const colorsArray = colors.split(',');

            const updatedColors = await Promise.all(colorsArray.map(async (color) => {
                const existingColor = existingIPad.colors.find(c => c.color === color);
                const uploadedImage = req.files.find(file => file.fieldname === `images_${color}`);

                console.log(`Processing color: ${color}, existingColor: ${existingColor ? existingColor : 'Not Found'}`);

                let imageUrl = existingColor?.image || '';

                if (uploadedImage) {
                    console.log(`Uploading image for color: ${color}`);
                    const fileName = `${modelName.replace(/\s/g, '_')}_${color}_${uuidv4()}`;
                    imageUrl = await uploadToCloudinary(uploadedImage, fileName);
                    console.log(`Uploaded image for color: ${color}, imageUrl: ${imageUrl}`);
                }

                return { color, image: imageUrl };
            }));

            existingIPad.colors = updatedColors;
        }

        if (storageSizes) {
            const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
            existingIPad.storageSizes = storageSizesArray.map(size => ({
                size: typeof size === 'object' ? size.size : size,
                deductionPercentage: size.deductionPercentage || 0,
            }));
        }

        if (paymentOptions)
        {
            const paymentOptionsArray = Array.isArray(paymentOptions)
            ? paymentOptions
            : JSON.parse(paymentOptions)

            existingIPad.paymentOptions = paymentOptionsArray.map(item => ({
                option: item.option,
                deductionPercentage: item.deductionPercentage || 0,
            }));
        }

    if (Array.isArray(batteryHealth)) {
      existingIPad.batteryHealth = batteryHealth.map(item => ({
        health: item.health,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    if (Array.isArray(cosmeticIssues)) {
      existingIPad.cosmeticIssues = cosmeticIssues.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(faults)) {
      existingIPad.faults = faults.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(repairs)) {
      existingIPad.repairs = repairs.map(item => ({
        repair: item.repair,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(frontScreen)) {
      existingIPad.frontScreen = frontScreen.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(body)) {
        existingIPad.body = body.map(item => ({
            header: item.header,
            condition: item.condition,
            deductionPercentage: item.deductionPercentage || 0,
            image: item.image || '',
        }));
    }

    if (Array.isArray(accessories)) {
      existingIPad.accessories = accessories.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(pta)) {
      existingIPad.pta = pta.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    if (Array.isArray(applePencil)) {
      existingIPad.applePencil = applePencil.map(item => ({
        generation: item.generation,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    if (Array.isArray(connectivity)) {
      existingIPad.connectivity = connectivity.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    existingIPad.batteryHealth = updateDeductionsIfZero(existingIPad.batteryHealth, batteryHealth, iPadBatteryHealthOptions);
    existingIPad.cosmeticIssues = updateDeductionsIfZero(existingIPad.cosmeticIssues, cosmeticIssues, defaultCosmeticIssues);
    existingIPad.faults = updateDeductionsIfZero(existingIPad.faults, faults, iPadFaultsOptions);
    existingIPad.repairs = updateDeductionsIfZero(existingIPad.repairs, repairs, defaultRepairs);
    existingIPad.frontScreen = updateDeductionsIfZero(existingIPad.frontScreen, frontScreen, defaultFrontScreen);
    existingIPad.body = updateDeductionsIfZero(existingIPad.body, body, defaultBody);
    existingIPad.accessories = updateDeductionsIfZero(existingIPad.accessories, accessories, defaultAccessories);
    existingIPad.pta = updateDeductionsIfZero(existingIPad.pta, pta, defaultPTA);
    existingIPad.applePencil = updateDeductionsIfZero(existingIPad.applePencil, applePencil, defaultApplePencil);
    existingIPad.connectivity = updateDeductionsIfZero(existingIPad.connectivity, connectivity, defaultConnectivity);
    existingIPad.accessories = updateDeductionsIfZero(existingIPad.accessories, accessories, defaultAccessories);


    const updatedIPad = await existingIPad.save();

    res.json(updatedIPad);
    } catch (error) {
    console.error('Error in updating iPad: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id/device-details', upload.any(), async(req, res) => {
    try {
        const {
            vendor,
            deviceType,
            modelName,
            maxPrice,
            colors,
            storageSizes,
            paymentOptions,
            batteryHealth,
            cosmeticIssues,
            faults,
            repairs,
            frontScreen,
            body,
            accessories,
            pta,
            applePencil,
            connectivity,
        } = req.body;

        const existingIPad = await iPad.findById(req.params.id);
        if (!existingIPad) {
            return res.status(404).json({ error: 'iPad not found' });
        }

        console.log('Received Body: ', req.body);
        console.log('Received Files: ', req.files);

        const filterBatteryHealthOptionsForiPads = (modelName) => {
  const allOptions = [
    { health: '95% or Above', deductionPercentage: 0 },
    { health: '90% or Above', deductionPercentage: 0 },
    { health: '85% or Above', deductionPercentage: 0 },
    { health: '80% or Above', deductionPercentage: 0 },
    { health: 'Less than 80%', deductionPercentage: 0 },
  ];

  if (['iPad - 10th Generation (2022)', 'iPad Air - 5th Generation (2022)', 'iPad Pro 11-inch - 4th Generation (2022)'].includes(modelName)) {
    return allOptions.filter((option) => ['95% or Above', '90% or Above', '85% or Above'].includes(option.health));
  } else if (['iPad - 9th Generation (2021)', 'iPad mini - 6th Generation (2021)', 'iPad Pro 12.9-inch - 5th Generation (2021)'].includes(modelName)) {
    return allOptions.filter((option) => ['90% or Above', '85% or Above', '80% or Above'].includes(option.health));
  } else {
    return allOptions.filter((option) => ['85% or Above', '80% or Above', 'Less than 80%'].includes(option.health));
  }
};

// Apply the filtered battery health options based on the iPad model name
const iPadBatteryHealthOptions = filterBatteryHealthOptionsForiPads(modelName);


    const defaultCosmeticIssues = [
      { header: 'Damaged Display', condition: 'Front glass is cracked or shattered', deductionPercentage: 0 },
      { header: 'Damaged Body', condition: 'Body is bent/broken or heavily dented', deductionPercentage: 0 },
      { header: 'Damaged Camera Lens', condition: 'Camera lens is cracked or shattered', deductionPercentage: 0 },
    ];

    const paymentOptionsArray = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
    console.log('Payment Options Array: ', paymentOptionsArray);

    // Function to filter out Faulty Face ID based on the model name
const filterFaultsForiPads = (modelName) => {
  const allFaults = [
      { header: 'Faulty Display', condition: 'Dead Pixels/Spots/Lines', deductionPercentage: 0},
      { header: 'Faulty Earpiece', condition: 'No Audio/Noisy Audio during phone calls', deductionPercentage: 0 },
      { header: 'Faulty Face ID', condition: 'Face ID is not working or not working consistently', deductionPercentage: 0 },
      { header: 'Faulty Proximity Sensor', condition: 'Display remains on during calls', deductionPercentage: 0 },
      { header: 'Faulty Vibration Motor', condition: 'No Vibration/Rattling Noise', deductionPercentage: 0 },
      { header: 'Faulty Power Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0 },
      { header: 'Faulty Volume Button', condition: 'Not Working/Hard to Press', deductionPercentage: 0 },
      { header: 'Faulty Mute Switch', condition: 'Not Working/Not Switching', deductionPercentage: 0 },
      { header: 'Faulty Front Camera', condition: 'Front Camera does not work, or the image is blurry', deductionPercentage: 0 },
      { header: 'Faulty Rear Camera', condition: 'Rear Camera does not work, or the image is blurry', deductionPercentage: 0 },
      { header: 'Faulty Flash', condition: 'Dead/Not Working', deductionPercentage: 0 },
      { header: 'Faulty Microphone', condition: 'Not Working/Noisy', deductionPercentage: 0 },
      { header: 'Faulty Loudspeaker', condition: 'No Audio/Noisy Audio', deductionPercentage: 0 },
      { header: 'Faulty Charging Port', condition: 'Dead/Not Working', deductionPercentage: 0 },
  ];

  // Exclude Faulty Face ID for certain iPad models
  if (['iPad - 9th Generation (2021)',
    'iPad mini - 6th Generation (2021)',
    'iPad Pro 12.9-inch - 5th Generation (2021)',
    'iPad Air - 5th Generation (2022)'].includes(modelName)) {
    return allFaults.filter((fault) => fault.header !== 'Faulty Face ID');
  }

  // Return all faults if the model is not in the list
  return allFaults;
};

// Apply the filtered faults based on the iPad model name
const iPadFaultsOptions = filterFaultsForiPads(modelName);


    const defaultRepairs = [
      { repair: 'Touch Screen Replaced', deductionPercentage: 0 },
      { repair: 'Display Replaced', deductionPercentage: 0 },
      { repair: 'Front Camera Replaced', deductionPercentage: 0 },
      { repair: 'Back Camera Replaced', deductionPercentage: 0 },
      { repair: 'Loudspeaker Replaced', deductionPercentage: 0 },
      { repair: 'Earpiece Replaced', deductionPercentage: 0 },
      { repair: 'Microphone Replaced', deductionPercentage: 0 },
      { repair: 'Battery Replaced', deductionPercentage: 0 },
      { repair: 'Battery Replaced by REGEN', deductionPercentage: 0 },
      { repair: 'Motherboard Repaired', deductionPercentage: 0 },
      { repair: 'Other Repairs', deductionPercentage: 0 }
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
      { option: 'iPad Only', deductionPercentage: 0, image: '' }
    ];

    const defaultApplePencil = [
    { generation: '1st Generation', header: 'Excellent', condition: 'Almost like new with no visible signs of wear.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Good', condition: 'Some minor signs of use such as small scratches.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Fair', condition: 'Visible signs of use with noticeable scratches or marks.', deductionPercentage: 0 },
    { generation: '1st Generation', header: 'Acceptable', condition: 'Heavily used with clear signs of wear, possibly with functional defects.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Excellent', condition: 'Almost like new with no visible signs of wear.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Good', condition: 'Some minor signs of use such as small scratches.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Fair', condition: 'Visible signs of use with noticeable scratches or marks.', deductionPercentage: 0 },
    { generation: '2nd Generation', header: 'Acceptable', condition: 'Heavily used with clear signs of wear, possibly with functional defects.', deductionPercentage: 0 }
];

    const defaultConnectivity = [
        { option: 'WiFi + Cellular', deductionPercentage: 0 },
        { option: 'WiFi Only', deductionPercentage: 0 },
    ];

    const defaultPTA = [
      { option: 'Is Your iPad PTA Approved?', deductionPercentage: 0 },
      { option: 'Is Your iPad Factory Unlocked?', deductionPercentage: 0 }
    ];

        if (vendor) existingIPad.vendor = vendor;
        if (deviceType) existingIPad.deviceType = deviceType;
        if (modelName) existingIPad.modelName = modelName;
        if (maxPrice) existingIPad.maxPrice = maxPrice;

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

        if (colors) {
            const colorsArray = colors.split(',');

            const updatedColors = await Promise.all(colorsArray.map(async (color) => {
                const existingColor = existingIPad.colors.find(c => c.color === color);
                const uploadedImage = req.files.find(file => file.fieldname === `images_${color}`);

                console.log(`Processing color: ${color}, existingColor: ${existingColor ? existingColor : 'Not Found'}`);

                let imageUrl = existingColor?.image || '';

                if (uploadedImage) {
                    console.log(`Uploading image for color: ${color}`);
                    const fileName = `${modelName.replace(/\s/g, '_')}_${color}_${uuidv4()}`;
                    imageUrl = await uploadToCloudinary(uploadedImage, fileName);
                    console.log(`Uploaded image for color: ${color}, imageUrl: ${imageUrl}`);
                }

                return { color, image: imageUrl };
            }));

            existingIPad.colors = updatedColors;
        }

        if (storageSizes) {
            const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
            existingIPad.storageSizes = storageSizesArray.map(size => ({
                size: typeof size === 'object' ? size.size : size,
                deductionPercentage: size.deductionPercentage || 0,
            }));
        }

        if (paymentOptions)
        {
            const paymentOptionsArray = Array.isArray(paymentOptions)
            ? paymentOptions
            : JSON.parse(paymentOptions)

            existingIPad.paymentOptions = paymentOptionsArray.map(item => ({
                option: item.option,
                deductionPercentage: item.deductionPercentage || 0,
            }));
        }

    if (Array.isArray(batteryHealth)) {
      existingIPad.batteryHealth = batteryHealth.map(item => ({
        health: item.health,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    if (Array.isArray(cosmeticIssues)) {
      existingIPad.cosmeticIssues = cosmeticIssues.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(faults)) {
      existingIPad.faults = faults.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(repairs)) {
      existingIPad.repairs = repairs.map(item => ({
        repair: item.repair,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(frontScreen)) {
      existingIPad.frontScreen = frontScreen.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(body)) {
        existingIPad.body = body.map(item => ({
            header: item.header,
            condition: item.condition,
            deductionPercentage: item.deductionPercentage || 0,
            image: item.image || '',
        }));
    }

    if (Array.isArray(accessories)) {
      existingIPad.accessories = accessories.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    if (Array.isArray(pta)) {
      existingIPad.pta = pta.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    if (Array.isArray(applePencil)) {
      existingIPad.applePencil = applePencil.map(item => ({
        generation: item.generation,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    if (Array.isArray(connectivity)) {
      existingIPad.connectivity = connectivity.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    existingIPad.batteryHealth = updateDeductionsIfZero(existingIPad.batteryHealth, batteryHealth, iPadBatteryHealthOptions);
    existingIPad.cosmeticIssues = updateDeductionsIfZero(existingIPad.cosmeticIssues, cosmeticIssues, defaultCosmeticIssues);
    existingIPad.faults = updateDeductionsIfZero(existingIPad.faults, faults, iPadFaultsOptions);
    existingIPad.repairs = updateDeductionsIfZero(existingIPad.repairs, repairs, defaultRepairs);
    existingIPad.frontScreen = updateDeductionsIfZero(existingIPad.frontScreen, frontScreen, defaultFrontScreen);
    existingIPad.body = updateDeductionsIfZero(existingIPad.body, body, defaultBody);
    existingIPad.accessories = updateDeductionsIfZero(existingIPad.accessories, accessories, defaultAccessories);
    existingIPad.pta = updateDeductionsIfZero(existingIPad.pta, pta, defaultPTA);
    existingIPad.applePencil = updateDeductionsIfZero(existingIPad.applePencil, applePencil, defaultApplePencil);
    existingIPad.connectivity = updateDeductionsIfZero(existingIPad.connectivity, connectivity, defaultConnectivity);
    existingIPad.accessories = updateDeductionsIfZero(existingIPad.accessories, accessories, defaultAccessories);


    const updatedIPad = await existingIPad.save();
    
    res.json(updatedIPad);
    } catch (error) {
    console.error('Error in updating iPad: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to get all iPads or fetch by ID
router.get('/', async (req, res) => {
    try {
        const id = req.query.id;

        if (id) {
            console.log(`Fetching iPad with ID: ${id}`);
            const fetchedIPad = await iPad.findOne({ id: id});

            if (fetchedIPad) {
                res.json(fetchedIPad);
            } else {
                res.status(404).json({ error: 'iPad not found' });
            }
        } else {
            const IPads = await iPad.find();
            res.json(IPads);
        }
    } catch (error) {
        console.error('Error retrieving iPads: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to get iPad by model name
router.get('/:modelName', async (req, res) => {
    try {
        const modelName = req.params.modelName;
        if (!modelName) {
            return res.status(400).json({ error: 'Model name is required' });
        }

        const fetchedIPad = await iPad.findOne({ modelName });
        if (!fetchedIPad) {
            return res.status(404).json({ message: 'iPad not found' });
        }
        res.json(fetchedIPad);
    } catch (error) {
        console.error('Error retrieving iPad:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedIPad = await iPad.findByIdAndDelete(id);

        if (!deletedIPad) {
            return res.status(404).json({ message: 'iPad not found '})
        }
        res.json({ message: 'iPad deleted successfully' });
    } catch (error) {
        console.error('Error deleting iPad', error);
        res.status(500).json({ message: 'Interval Server Error '});
    }
});

module.exports = router;