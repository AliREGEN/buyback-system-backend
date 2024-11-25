const express = require('express');
const router = express.Router();
const iPhone = require('../models/iPhone');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const BatteryHealth = require('../models/batteryHealthOption');
const CosmeticIssues = require('../models/cosmeticIssueOption');
const Faults = require('../models/faultOption');
const Repairs = require('../models/repairOption');
const FrontScreen = require('../models/frontScreenOption');
const Back = require('../models/backOption');
const Side = require('../models/sideOption');
const SIMVariant = require('../models/simVariantOption');
const PTA = require('../models/ptaOption');
const Accessories = require('../models/accessoriesOption');
const UnknownPart = require('../models/unknownPartOption');

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        folder: 'iphone_images',
        format: 'webp', // Specify the format to be webp
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        // Apply transformations to the returned URL
        const transformedUrl = result.secure_url.replace(
          '/upload/',
          '/upload/c_fill,h_300,w_300/dpr_2.0/f_webp/q_auto:best/'
        );
        
        resolve(transformedUrl);
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


// Helper function to fetch options from the respective collections
const fetchOptions = async () => {
  const batteryHealthOptions = await BatteryHealth.find();
  const cosmeticIssuesOptions = await CosmeticIssues.find();
  const faultsOptions = await Faults.find();
  const repairsOptions = await Repairs.find();
  const frontScreenOptions = await FrontScreen.find();
  const backOptions = await Back.find();
  const sideOptions = await Side.find();
  const simVariantOptions = await SIMVariant.find();
  const ptaOptions = await PTA.find();
  const accessoriesOptions = await Accessories.find();
  const unknownPartOptions = await UnknownPart.find();

  return {
    batteryHealthOptions,
    cosmeticIssuesOptions,
    faultsOptions,
    repairsOptions,
    frontScreenOptions,
    backOptions,
    sideOptions,
    simVariantOptions,
    ptaOptions,
    accessoriesOptions,
    unknownPartOptions,
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


// Example usage of fetchOptions in POST route to add a new iPhone
router.post('/', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    // Log options fetched from collections for debugging
    console.log('Available options:', options);

    const {
      vendor, deviceType, modelName, maxPrice, colors, storageSizes, paymentOptions,
      batteryHealth, cosmeticIssues, faults, repairs, frontScreen, back, side, simVariant, pta, accessories, unknownParts
    } = req.body;

    // Parsing the passed data, only if values exist
    const parsedBatteryHealth = batteryHealth ? safeParse(batteryHealth) : [];
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : [];
    const parsedFaults = faults ? safeParse(faults) : [];
    const parsedRepairs = repairs ? safeParse(repairs) : [];
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : [];
    const parsedBack = back ? safeParse(back) : [];
    const parsedSide = side ? safeParse(side) : [];
    const parsedSimVariant = simVariant ? safeParse(simVariant) : [];
    const parsedPta = pta ? safeParse(pta) : [];
    const parsedAccessories = accessories ? safeParse(accessories) : [];
    const parsedUnknownParts = unknownParts ? safeParse(unknownParts) : [];

    // Log parsed data for debugging
    console.log('Parsed Battery Health:', parsedBatteryHealth);
    console.log('Parsed Cosmetic Issues:', parsedCosmeticIssues);
    console.log('Parsed Faults:', parsedFaults);
    console.log('Parsed Repairs:', parsedRepairs);
    console.log('Parsed Front Screen:', parsedFrontScreen);
    console.log('Parsed Back:', parsedBack);
    console.log('Parsed Side:', parsedSide);
    console.log('Parsed SIM Variant:', parsedSimVariant);
    console.log('Parsed PTA:', parsedPta);
    console.log('Parsed Accessories:', parsedAccessories);
    console.log('Parsed Unknown Parts:', parsedUnknownParts);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctBatteryHealthIds = parsedBatteryHealth.length ? mapDynamicOptions(parsedBatteryHealth, options.batteryHealthOptions) : [];
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : [];
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : [];
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : [];
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : [];
    const correctBackIds = parsedBack.length ? mapDynamicOptions(parsedBack, options.backOptions) : [];
    const correctSideIds = parsedSide.length ? mapDynamicOptions(parsedSide, options.sideOptions) : [];
    const correctSimVariantIds = parsedSimVariant.length ? mapDynamicOptions(parsedSimVariant, options.simVariantOptions) : [];
    const correctPtaIds = parsedPta.length ? mapDynamicOptions(parsedPta, options.ptaOptions) : [];
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : [];
    const correctUnknownPartIds = parsedUnknownParts.length ? mapDynamicOptions(parsedUnknownParts, options.unknownPartOptions) : [];

    // Log mapped IDs for debugging
    console.log("Correct Fault Ids: ", correctFaultIds);
    console.log("Correct Cosmetic Issue Ids: ", correctCosmeticIssueIds);
    console.log("Correct Battery Health Ids: ", correctBatteryHealthIds);
    console.log("Correct Repair Ids: ", correctRepairIds);
    console.log("Correct Front Screen Ids: ", correctFrontScreenIds);
    console.log("Correct Back Ids: ", correctBackIds);
    console.log("Correct Side Ids: ", correctSideIds);
    console.log("Correct SIM Variant Ids: ", correctSimVariantIds);
    console.log("Correct PTA Ids: ", correctPtaIds);
    console.log("Correct Accessories Ids: ", correctAccessoriesIds);
    console.log("Correct Unknown Part Ids: ", correctUnknownPartIds);

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

    // Create new iPhone document with correct ObjectIDs
    const newiPhone = new iPhone({
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
      back: correctBackIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      side: correctSideIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      simVariant: correctSimVariantIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      pta: correctPtaIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      accessories: correctAccessoriesIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      unknownParts: correctUnknownPartIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
    });

    // Save the new iPhone document
    await newiPhone.save();
    console.log('New iPhone saved to MongoDB:', newiPhone);
    return res.status(201).json(newiPhone);

  } catch (error) {
    console.error('Error adding iPhone:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Consolidated PUT route for updating device management and device details
router.put('/:id', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    const {
      vendor, deviceType, modelName, maxPrice, colors, storageSizes, paymentOptions,
      batteryHealth, cosmeticIssues, faults, repairs, frontScreen, back, side, simVariant, pta, accessories, unknownParts
    } = req.body;

    // Find the existing iPhone document
    const existingIPhone = await iPhone.findById(req.params.id);
    if (!existingIPhone) {
      return res.status(404).json({ message: 'iPhone not found' });
    }

    // Parsing the passed data, only if values exist
    const parsedBatteryHealth = batteryHealth ? safeParse(batteryHealth) : existingIPhone.batteryHealth.map(opt => opt.option);
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : existingIPhone.cosmeticIssues.map(opt => opt.option);
    const parsedFaults = faults ? safeParse(faults) : existingIPhone.faults.map(opt => opt.option);
    const parsedRepairs = repairs ? safeParse(repairs) : existingIPhone.repairs.map(opt => opt.option);
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : existingIPhone.frontScreen.map(opt => opt.option);
    const parsedBack = back ? safeParse(back) : existingIPhone.back.map(opt => opt.option);
    const parsedSide = side ? safeParse(side) : existingIPhone.side.map(opt => opt.option);
    const parsedSimVariant = simVariant ? safeParse(simVariant) : existingIPhone.simVariant.map(opt => opt.option);
    const parsedPta = pta ? safeParse(pta) : existingIPhone.pta.map(opt => opt.option);
    const parsedAccessories = accessories ? safeParse(accessories) : existingIPhone.accessories.map(opt => opt.option);
    const parsedUnknownParts = unknownParts ? safeParse(unknownParts) : existingIPhone.unknownParts.map(opt => opt.option);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctBatteryHealthIds = parsedBatteryHealth.length ? mapDynamicOptions(parsedBatteryHealth, options.batteryHealthOptions) : existingIPhone.batteryHealth.map(opt => opt.option);
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : existingIPhone.cosmeticIssues.map(opt => opt.option);
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : existingIPhone.faults.map(opt => opt.option);
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : existingIPhone.repairs.map(opt => opt.option);
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : existingIPhone.frontScreen.map(opt => opt.option);
    const correctBackIds = parsedBack.length ? mapDynamicOptions(parsedBack, options.backOptions) : existingIPhone.back.map(opt => opt.option);
    const correctSideIds = parsedSide.length ? mapDynamicOptions(parsedSide, options.sideOptions) : existingIPhone.side.map(opt => opt.option);
    const correctSimVariantIds = parsedSimVariant.length ? mapDynamicOptions(parsedSimVariant, options.simVariantOptions) : existingIPhone.simVariant.map(opt => opt.option);
    const correctPtaIds = parsedPta.length ? mapDynamicOptions(parsedPta, options.ptaOptions) : existingIPhone.pta.map(opt => opt.option);
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : existingIPhone.accessories.map(opt => opt.option);
    const correctUnknownPartIds = parsedUnknownParts.length ? mapDynamicOptions(parsedUnknownParts, options.unknownPartOptions) : existingIPhone.unknownParts.map(opt => opt.option);

    // Log mapped IDs for debugging
    console.log("Correct Fault Ids: ", correctFaultIds);
    console.log("Correct Cosmetic Issue Ids: ", correctCosmeticIssueIds);
    console.log("Correct Battery Health Ids: ", correctBatteryHealthIds);
    console.log("Correct Repair Ids: ", correctRepairIds);
    console.log("Correct Front Screen Ids: ", correctFrontScreenIds);
    console.log("Correct Back Ids: ", correctBackIds);
    console.log("Correct Side Ids: ", correctSideIds);
    console.log("Correct SIM Variant Ids: ", correctSimVariantIds);
    console.log("Correct PTA Ids: ", correctPtaIds);
    console.log("Correct Accessories Ids: ", correctAccessoriesIds);
    console.log("Correct Unknown Part Ids: ", correctUnknownPartIds);

    if (vendor) {
      existingIPhone.vendor = vendor;
    }
    if (deviceType) {
      existingIPhone.deviceType = deviceType;
    }
    if (modelName) {
      existingIPhone.modelName = modelName;
    }
    if (maxPrice) {
      existingIPhone.maxPrice = maxPrice;
    }

    // Handle colors and image uploads
    if (colors) {
      const colorsArray = colors.split(',');
      const updatedColors = await Promise.all(colorsArray.map(async (color) => {
        const existingColor = existingIPhone.colors.find(c => c.color === color);
        const uploadedImage = req.files.find(file => file.fieldname === `images_${color}`);
        let imageUrl = existingColor?.image || '';
        if (uploadedImage) {
          const fileName = `${modelName.replace(/\s/g, '_')}_${color}_${uuidv4()}`;
          imageUrl = await uploadToCloudinary(uploadedImage, fileName);
        }
        return { color, image: imageUrl };
      }));
      existingIPhone.colors = updatedColors;
    }

    // Handle storage sizes
    if (storageSizes) {
      const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
      existingIPhone.storageSizes = storageSizesArray.map(size => ({
        size,
        deductionPercentage: 0,
      }));
    }

    if (paymentOptions) {
      existingIPhone.paymentOptions = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
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

    existingIPhone.batteryHealth = updateDeductionField(existingIPhone.batteryHealth, correctBatteryHealthIds);
    existingIPhone.cosmeticIssues = updateDeductionField(existingIPhone.cosmeticIssues, correctCosmeticIssueIds);
    existingIPhone.faults = updateDeductionField(existingIPhone.faults, correctFaultIds);
    existingIPhone.repairs = updateDeductionField(existingIPhone.repairs, correctRepairIds);
    existingIPhone.frontScreen = updateDeductionField(existingIPhone.frontScreen, correctFrontScreenIds);
    existingIPhone.back = updateDeductionField(existingIPhone.back, correctBackIds);
    existingIPhone.side = updateDeductionField(existingIPhone.side, correctSideIds);
    existingIPhone.simVariant = updateDeductionField(existingIPhone.simVariant, correctSimVariantIds);
    existingIPhone.pta = updateDeductionField(existingIPhone.pta, correctPtaIds);
    existingIPhone.accessories = updateDeductionField(existingIPhone.accessories, correctAccessoriesIds);
    existingIPhone.unknownParts = updateDeductionField(existingIPhone.unknownParts, correctUnknownPartIds);

    // Save the updated iPhone document
    const updatedIPhone = await existingIPhone.save();
    return res.json(updatedIPhone);  // Return the updated iPhone

  } catch (error) {
    console.error('Error updating iPhone:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});


// PUT route to update device details for a specific iPhone model
router.put('/:id/device-details', async (req, res) => {
  try {
    const iPhoneId = req.params.id;
    const updateFields = req.body;  // Contains the updated deduction percentages for specific categories
    console.log('Received updateFields:', updateFields);

    // Fetch the iPhone document from the database
    const fetchedIPhone = await iPhone.findById(iPhoneId);
    if (!fetchedIPhone) {
      return res.status(404).json({ message: 'iPhone not found' });
    }

    // Log the existing fetchedIPhone document for debugging
    console.log('Existing iPhone Document:', fetchedIPhone);

    // Iterate over each category (like batteryHealth, cosmeticIssues, etc.) in updateFields
    for (const category in updateFields) {
      if (Array.isArray(updateFields[category])) {
        updateFields[category].forEach(updatedOption => {
          console.log('Updating category:', category, 'with option:', updatedOption);

          // Find the corresponding option in the existing fetchedIPhone document
          const existingOption = fetchedIPhone[category].find(option => option._id.toString() === updatedOption._id.toString());

          if (existingOption) {
            // Update the deduction percentage for the matched option
            existingOption.deductionPercentage = updatedOption.deductionPercentage;
          }
        });
      }
    }

    // Save the updated fetchedIPhone document
    await fetchedIPhone.save();

    res.json(fetchedIPhone);  // Return the updated document to the frontend
  } catch (error) {
    console.error('Error updating iPhone details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Route to get all iPhones or fetch by ID
router.get('/', async (req, res) => {
  try {
    const id = req.query.id; // Get the id from query parameters

    if (id) {
      console.log(`Fetching iPhone with ID: ${id}`);

      // Fetch iPhone data and populate the option fields with actual data by _id
      const fetchedIPhone = await iPhone
        .findById(id)
        .populate('batteryHealth.option', 'option')
        .populate('cosmeticIssues.option', 'header condition')
        .populate('faults.option', 'header condition')
        .populate('repairs.option', 'option')
        .populate('frontScreen.option', 'header condition')
        .populate('back.option', 'header condition')
        .populate('side.option', 'header condition')
        .populate('simVariant.option', 'option')
        .populate('pta.option', 'option')
        .populate('accessories.option', 'option')
        .populate('unknownParts.option', 'option');

      console.log('Populated iPhone data:', JSON.stringify(fetchedIPhone, null, 2));

      if (fetchedIPhone) {
        res.json(fetchedIPhone);
      } else {
        res.status(404).json({ message: 'iPhone not found' });
      }
    } else {
      // Fetch all iPhones if no ID is provided
      const iPhones = await iPhone.find();
      res.json(iPhones);
    }
  } catch (error) {
    console.error('Error retrieving iPhones:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/filter', async (req, res) => {
  try {
    const { currentModel } = req.query;
    const allModels = await iPhone.find();
    const filteredModels = allModels.filter((model) => model.modelName > currentModel);
    res.status(200).json(filteredModels);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering models', error });
  }
});

// Route to get iPhone by model name
router.get('/:modelName', async (req, res) => {
  try {
    const modelName = req.params.modelName;

    // Fetch iPhone data and populate the option fields with actual data
    const fetchedIPhone = await iPhone
      .findOne({ modelName })
      .populate('batteryHealth.option', 'option')  // Assuming option is the field in BatteryHealth
      .populate('cosmeticIssues.option', 'header condition')  // Assuming header and condition are fields in CosmeticIssues
      .populate('faults.option', 'header condition')  // Assuming header and condition are fields in Faults
      .populate('repairs.option', 'option')  // Assuming option is the field in Repairs
      .populate('frontScreen.option', 'header condition')  // Assuming header and condition are fields in FrontScreen
      .populate('back.option', 'header condition')  // Assuming header and condition are fields in Back
      .populate('side.option', 'header condition')  // Assuming header and condition are fields in Side
      .populate('simVariant.option', 'option')  // Assuming option is the field in SIMVariant
      .populate('pta.option', 'option')  // Assuming option is the field in PTA
      .populate('accessories.option', 'option')  // Assuming option is the field in Accessories
      .populate('unknownParts.option', 'option');  // Assuming option is the field in UnknownPart

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
    return deletedIPhone ? res.json({ message: 'iPhone deleted successfully' }) : res.status(404).json({ message: 'iPhone not found' });
  } catch (error) {
    console.error('Error deleting iPhone:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
