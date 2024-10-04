const mongoose = require('mongoose');
const iPad = require('../models/iPad');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const BatteryHealth = require('../models/batteryHealthOption');
const CosmeticIssues = require('../models/cosmeticIssueOption');
const Connectivity = require('../models/connectivityOption');
const Faults = require('../models/faultOption');
const Repairs = require('../models/repairOption');
const FrontScreen = require('../models/frontScreenOption');
const Body = require('../models/bodyOption');
const ApplePencil = require('../models/applePencilOption');
const Accessories = require('../models/accessoriesOption');

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

// Helper function to safely parse JSON fields
const safeParse = (value) => {
  try {
    if (!value || value === 'undefined') {
      return []; // Return an empty array for undefined or invalid input
    }
    return JSON.parse(value); // Parse if it's a valid JSON string
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return []; // Return an empty array in case of error
  }
};

const fetchOptions = async () => {
  const batteryHealthOptions = await BatteryHealth.find();
  const cosmeticIssuesOptions = await CosmeticIssues.find();
  const connectivityOptions = await Connectivity.find();
  const applePencilOptions = await ApplePencil.find();
  const faultsOptions = await Faults.find();
  const repairsOptions = await Repairs.find();
  const frontScreenOptions = await FrontScreen.find();
  const bodyOptions = await Body.find();
  const accessoriesOptions = await Accessories.find();

  return {
    batteryHealthOptions,
    cosmeticIssuesOptions,
    connectivityOptions,
    faultsOptions,
    repairsOptions,
    frontScreenOptions,
    bodyOptions,
    accessoriesOptions,
    applePencilOptions,
  };
};

const mapDynamicOptions = (parsedArray, optionsArray) => {
  return parsedArray.map((item) => {
    const matchedOption = optionsArray.find(
      (opt) => opt._id.toString() === item.toString()  // Ensure ObjectId comparison consistency
    );
    if (matchedOption) {
      console.log(`Matched Option: ${matchedOption._id} for Parsed Item: ${item}`);
    } else {
      console.log(`No match found for Parsed Item: ${item}`);
    }
    return matchedOption ? matchedOption._id : null;
  }).filter(Boolean);  // Filter null or undefined results
};

router.post('/', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    // Log options fetched from collections for debugging
    console.log('Available options:', options);

    const {
      vendor, deviceType, modelName, maxPrice, colors, storageSizes, paymentOptions,
      batteryHealth, connectivity, cosmeticIssues, faults, repairs, frontScreen, body, applePencil ,accessories,
    } = req.body;

    // Parsing the passed data, only if values exist
    const parsedBatteryHealth = batteryHealth ? safeParse(batteryHealth) : [];
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : [];
    const parsedConnectivity = connectivity ? safeParse(connectivity) : [];
    const parsedFaults = faults ? safeParse(faults) : [];
    const parsedRepairs = repairs ? safeParse(repairs) : [];
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : [];
    const parsedBody = body ? safeParse(body) : [];
    const parsedAccessories = accessories ? safeParse(accessories) : [];
    const parsedApplePencil = applePencil ? safeParse(applePencil) : [];

    // Log parsed data for debugging
    console.log('Parsed Battery Health:', parsedBatteryHealth);
    console.log('Parsed Cosmetic Issues:', parsedCosmeticIssues);
    console.log('Parsed Connectivity:', parsedConnectivity);
    console.log('Parsed Faults:', parsedFaults);
    console.log('Parsed Repairs:', parsedRepairs);
    console.log('Parsed Front Screen:', parsedFrontScreen);
    console.log('Parsed Body:', parsedBody);
    console.log('Parsed Apple Pencil:', parsedApplePencil);
    console.log('Parsed Accessories:', parsedAccessories);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctBatteryHealthIds = parsedBatteryHealth.length ? mapDynamicOptions(parsedBatteryHealth, options.batteryHealthOptions) : [];
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : [];
    const correctConnectivityIds = parsedConnectivity.length ? mapDynamicOptions(parsedConnectivity, options.connectivityOptions) : [];
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : [];
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : [];
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : [];
    const correctBodyIds = parsedBody.length ? mapDynamicOptions(parsedBody, options.bodyOptions) : [];
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : [];
    const correctApplePencilIds = parsedApplePencil.length ? mapDynamicOptions(parsedApplePencil, options.applePencilOptions) : [];

    // Log mapped IDs for debugging
    console.log("Correct Fault Ids: ", correctFaultIds);
    console.log("Correct Cosmetic Issue Ids: ", correctCosmeticIssueIds);
    console.log("Correct Battery Health Ids: ", correctBatteryHealthIds);
    console.log("Correct Connectivity Ids: ", correctConnectivityIds);
    console.log("Correct Repair Ids: ", correctRepairIds);
    console.log("Correct Front Screen Ids: ", correctFrontScreenIds);
    console.log("Correct Body Ids: ", correctBodyIds);
    console.log("Correct Accessories Ids: ", correctAccessoriesIds);
    console.log("Correct Apple Pencil Ids: ", correctApplePencilIds);

    const colorsArray = colors ? colors.split(',') : [];
    const storageSizesArray = storageSizes ? storageSizes.split(',') : [];
    let colorImageArray = [];

    // Image handling
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

    // Create new iPad document with correct ObjectIDs
    const newiPad = new iPad({
      id: uuidv4(),
      vendor,
      deviceType,
      modelName,
      maxPrice,
      colors: colorImageArray,
      storageSizes: storageSizesArray.map(size => ({
        size,
        deductionPercentage: 0,
      })),
      paymentOptions: Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]'),
      batteryHealth: correctBatteryHealthIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      cosmeticIssues: correctCosmeticIssueIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      faults: correctFaultIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      repairs: correctRepairIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      frontScreen: correctFrontScreenIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      body: correctBodyIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      accessories: correctAccessoriesIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      applePencil: correctApplePencilIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
    });

    // Save the new iPad document
    await newiPad.save();
    console.log('New iPad saved to MongoDB:', newiPad);
    return res.status(201).json(newiPad);

  } catch (error) {
    console.error('Error adding iPad:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Update iPad fields
router.put('/:id', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    const {
      vendor, deviceType, modelName, maxPrice, colors, storageSizes, paymentOptions,
      batteryHealth, cosmeticIssues, connectivity , faults, repairs, frontScreen, body, accessories, applePencil,
    } = req.body;

    // Find the existing iPad document
    const existingiPad = await iPad.findById(req.params.id);
    if (!existingiPad) {
      return res.status(404).json({ message: 'iPad not found' });
    }

    // Parsing the passed data, only if values exist
    const parsedBatteryHealth = batteryHealth ? safeParse(batteryHealth) : existingiPad.batteryHealth.map(opt => opt.option);
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : existingiPad.cosmeticIssues.map(opt => opt.option);
    const parsedConnectivity = connectivity ? safeParse(connectivity) : existingiPad.connectivity.map(opt => opt.option);
    const parsedFaults = faults ? safeParse(faults) : existingiPad.faults.map(opt => opt.option);
    const parsedRepairs = repairs ? safeParse(repairs) : existingiPad.repairs.map(opt => opt.option);
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : existingiPad.frontScreen.map(opt => opt.option);
    const parsedBody = body ? safeParse(body) : existingiPad.body.map(opt => opt.option);
    const parsedAccessories = accessories ? safeParse(accessories) : existingiPad.accessories.map(opt => opt.option);
    const parsedApplePencil = applePencil ? safeParse(applePencil) : existingiPad.applePencil.map(opt => opt.option);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctBatteryHealthIds = parsedBatteryHealth.length ? mapDynamicOptions(parsedBatteryHealth, options.batteryHealthOptions) : existingiPad.batteryHealth.map(opt => opt.option);
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : existingiPad.cosmeticIssues.map(opt => opt.option);
    const correctConnectivityIds = parsedConnectivity.length ? mapDynamicOptions(parsedConnectivity, options.connectivityOptions) : existingiPad.connectivity.map(opt => opt.option);
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : existingiPad.faults.map(opt => opt.option);
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : existingiPad.repairs.map(opt => opt.option);
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : existingiPad.frontScreen.map(opt => opt.option);
    const correctBodyIds = parsedBody.length ? mapDynamicOptions(parsedBody, options.bodyOptions) : existingiPad.body.map(opt => opt.option);
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : existingiPad.accessories.map(opt => opt.option);
    const correctApplePencilIds = parsedApplePencil.length ? mapDynamicOptions(parsedApplePencil, options.applePencilOptions) : existingiPad.applePencil.map(opt => opt.option);

    // Log mapped IDs for debugging
    console.log("Correct Fault Ids: ", correctFaultIds);
    console.log("Correct Cosmetic Issue Ids: ", correctCosmeticIssueIds);
    console.log("Correct Connectivity Ids: ", correctConnectivityIds);
    console.log("Correct Battery Health Ids: ", correctBatteryHealthIds);
    console.log("Correct Repair Ids: ", correctRepairIds);
    console.log("Correct Front Screen Ids: ", correctFrontScreenIds);
    console.log("Correct Body Ids: ", correctBodyIds);
    console.log("Correct Accessories Ids: ", correctAccessoriesIds);
    console.log("Correct Apple Pencil Ids: ", correctApplePencilIds);

    if (vendor) {
      existingiPad.vendor = vendor;
    }
    if (deviceType) {
      existingiPad.deviceType = deviceType;
    }
    if (modelName) {
      existingiPad.modelName = modelName;
    }
    if (maxPrice) {
      existingiPad.maxPrice = maxPrice;
    }

    // Handle colors and image uploads
    if (colors) {
      const colorsArray = colors.split(',');
      const updatedColors = await Promise.all(colorsArray.map(async (color) => {
        const existingColor = existingiPad.colors.find(c => c.color === color);
        const uploadedImage = req.files.find(file => file.fieldname === `images_${color}`);
        let imageUrl = existingColor?.image || '';
        if (uploadedImage) {
          const fileName = `${modelName.replace(/\s/g, '_')}_${color}_${uuidv4()}`;
          imageUrl = await uploadToCloudinary(uploadedImage, fileName);
        }
        return { color, image: imageUrl };
      }));
      existingiPad.colors = updatedColors;
    }

    // Handle storage sizes
    if (storageSizes) {
      const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
      existingiPad.storageSizes = storageSizesArray.map(size => ({
        size,
        deductionPercentage: 0,
      }));
    }

    if (paymentOptions) {
      existingiPad.paymentOptions = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
    }

    // Update deduction fields but retain the non-zero deduction percentages
    const updateDeductionField = (existingField, newOptions) => {
      return newOptions.map(optionId => {
        const existingOption = existingField.find(opt => opt.option.toString() === optionId.toString());
        return {
          option: optionId,
          deductionPercentage: existingOption && existingOption.deductionPercentage !== 0 
            ? existingOption.deductionPercentage  // Keep the non-zero deduction percentage
            : 0  // Set to 0 if it's a new entry or the current value is 0
        };
      });
    };

    existingiPad.batteryHealth = updateDeductionField(existingiPad.batteryHealth, correctBatteryHealthIds);
    existingiPad.cosmeticIssues = updateDeductionField(existingiPad.cosmeticIssues, correctCosmeticIssueIds);
    existingiPad.connectivity = updateDeductionField(existingiPad.connectivity, correctConnectivityIds);
    existingiPad.faults = updateDeductionField(existingiPad.faults, correctFaultIds);
    existingiPad.repairs = updateDeductionField(existingiPad.repairs, correctRepairIds);
    existingiPad.frontScreen = updateDeductionField(existingiPad.frontScreen, correctFrontScreenIds);
    existingiPad.body = updateDeductionField(existingiPad.body, correctBodyIds);
    existingiPad.accessories = updateDeductionField(existingiPad.accessories, correctAccessoriesIds);
    existingiPad.applePencil = updateDeductionField(existingiPad.applePencil, correctApplePencilIds);

    // Save the updated iPad document
    const updatediPad = await existingiPad.save();
    return res.json(updatediPad);  // Return the updated iPad

  } catch (error) {
    console.error('Error updating iPad:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id/device-details', async (req, res) => {
  try {
    const iPadId = req.params.id;
    const updateFields = req.body;  // Contains the updated deduction percentages for specific categories
    console.log('Received updateFields:', updateFields);

    // Fetch the IPad document from the database
    const fetchedIPad = await iPad.findById(iPadId);
    if (!fetchedIPad) {
      return res.status(404).json({ message: 'IPad not found' });
    }

    // Log the existing fetchedIPad document for debugging
    console.log('Existing IPad Document:', fetchedIPad);

    // Iterate over each category (like batteryHealth, cosmeticIssues, etc.) in updateFields
    for (const category in updateFields) {
      if (Array.isArray(updateFields[category])) {
        updateFields[category].forEach(updatedOption => {
          console.log('Updating category:', category, 'with option:', updatedOption);

          // Find the corresponding option in the existing fetchedIPad document
          const existingOption = fetchedIPad[category].find(option => option._id.toString() === updatedOption._id.toString());

          if (existingOption) {
            // Update the deduction percentage for the matched option
            existingOption.deductionPercentage = updatedOption.deductionPercentage;
          }
        });
      }
    }

    // Save the updated fetchedIPad document
    await fetchedIPad.save();

    res.json(fetchedIPad);  // Return the updated document to the frontend
  } catch (error) {
    console.error('Error updating IPad details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Route to get all iPads or fetch by ID
router.get('/', async (req, res) => {
  try {
    const id = req.query.id; // Get the id from query parameters

    if (id) {
      console.log(`Fetching IPad with ID: ${id}`);

      // Fetch IPad data and populate the option fields with actual data by _id
      const fetchedIPad = await iPad
        .findById(id)
        .populate('batteryHealth.option', 'option')
        .populate('cosmeticIssues.option', 'header condition')
        .populate('faults.option', 'header condition')
        .populate('repairs.option', 'option')
        .populate('frontScreen.option', 'header condition')
        .populate('body.option', 'header condition')
        .populate('accessories.option', 'option')
        .populate('connectivity.option', 'option')
        .populate('applePencil.option', 'generation header condition');

      console.log('Populated IPad data:', JSON.stringify(fetchedIPad, null, 2));

      if (fetchedIPad) {
        res.json(fetchedIPad);
      } else {
        res.status(404).json({ message: 'IPad not found' });
      }
    } else {
      // Fetch all IPads if no ID is provided
      const iPads = await iPad.find();
      res.json(iPads);
    }
  } catch (error) {
    console.error('Error retrieving IPads:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get iPad by model name
router.get('/:modelName', async (req, res) => {
  try {
    const modelName = req.params.modelName;

    // Fetch IPad data and populate the option fields with actual data
    const fetchedIPad = await iPad
      .findOne({ modelName })
      .populate('batteryHealth.option', 'option')  // Assuming option is the field in BatteryHealth
      .populate('cosmeticIssues.option', 'header condition')  // Assuming header and condition are fields in CosmeticIssues
      .populate('connectivity.option', 'option')  // Assuming option is the field in Connectivity
      .populate('faults.option', 'header condition')  // Assuming header and condition are fields in Faults
      .populate('repairs.option', 'option')  // Assuming option is the field in Repairs
      .populate('frontScreen.option', 'header condition')  // Assuming header and condition are fields in FrontScreen
      .populate('body.option', 'header condition')  // Assuming header and condition are fields in Back
      .populate('accessories.option', 'option')  // Assuming option is the field in Accessories
      .populate('applePencil.option', 'generation header condition');  // Assuming generation, header, and condition are fields in ApplePencil

    if (!fetchedIPad) {
      return res.status(404).json({ message: 'IPad not found' });
    }

    res.json(fetchedIPad);
  } catch (error) {
    console.error('Error retrieving IPad:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedIPad = await iPad.findByIdAndDelete(id);
    return deletedIPad ? res.json({ message: 'IPad deleted successfully' }) : res.status(404).json({ message: 'IPad not found' });
  } catch (error) {
    console.error('Error deleting IPad:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;