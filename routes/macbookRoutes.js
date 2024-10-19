const mongoose = require('mongoose');
const MacBook = require('../models/Macbook');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const ProcessorTypes = require('../models/processorOption');
const BatteryHealth = require('../models/batteryHealthOption');
const CosmeticIssues = require('../models/cosmeticIssueOption');
const Faults = require('../models/faultOption');
const Repairs = require('../models/repairOption');
const FrontScreen = require('../models/frontScreenOption');
const Body = require('../models/bodyOption');
const SIMVariant = require('../models/simVariantOption');
const Accessories = require('../models/accessoriesOption');

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
  const processorTypesOptions = await ProcessorTypes.find();
  const cosmeticIssuesOptions = await CosmeticIssues.find();
  const faultsOptions = await Faults.find();
  const repairsOptions = await Repairs.find();
  const frontScreenOptions = await FrontScreen.find();
  const bodyOptions = await Body.find();
  const accessoriesOptions = await Accessories.find();

  return {
    batteryHealthOptions,
    processorTypesOptions,
    cosmeticIssuesOptions,
    faultsOptions,
    repairsOptions,
    frontScreenOptions,
    bodyOptions,
    accessoriesOptions,
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


// Example usage of fetchOptions in POST route to add a new MacBook
router.post('/', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    // Log options fetched from collections for debugging
    console.log('Available options:', options);

    const {
      vendor, deviceType, modelName, memorySizes ,maxPrice, colors, storageSizes, paymentOptions,
      batteryHealth, cosmeticIssues, processorTypes ,faults, repairs, frontScreen, body, accessories,
    } = req.body;

    // Parsing the passed data, only if values exist
    const parsedBatteryHealth = batteryHealth ? safeParse(batteryHealth) : [];
    const parsedProcessorTypes = processorTypes ? safeParse(processorTypes) : [];
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : [];
    const parsedFaults = faults ? safeParse(faults) : [];
    const parsedRepairs = repairs ? safeParse(repairs) : [];
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : [];
    const parsedBody = body ? safeParse(body) : [];
    const parsedAccessories = accessories ? safeParse(accessories) : [];

    // Log parsed data for debugging
    console.log('Parsed Battery Health:', parsedBatteryHealth);
    console.log('Parsed Cosmetic Issues:', parsedCosmeticIssues);
    console.log('Parsed Processor Types:', parsedProcessorTypes);
    console.log('Parsed Faults:', parsedFaults);
    console.log('Parsed Repairs:', parsedRepairs);
    console.log('Parsed Front Screen:', parsedFrontScreen);
    console.log('Parsed Body:', parsedBody);
    console.log('Parsed Accessories:', parsedAccessories);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctBatteryHealthIds = parsedBatteryHealth.length ? mapDynamicOptions(parsedBatteryHealth, options.batteryHealthOptions) : [];
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : [];
    const correctProcessorTypeIds = parsedProcessorTypes.length ? mapDynamicOptions(parsedProcessorTypes, options.processorTypesOptions) : [];
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : [];
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : [];
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : [];
    const correctBodyIds = parsedBody.length ? mapDynamicOptions(parsedBody, options.bodyOptions) : [];
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : [];

    // Log mapped IDs for debugging
    console.log("Correct Fault Ids: ", correctFaultIds);
    console.log("Correct Cosmetic Issue Ids: ", correctCosmeticIssueIds);
    console.log("Correct Processor Type Ids: ", correctProcessorTypeIds);
    console.log("Correct Battery Health Ids: ", correctBatteryHealthIds);
    console.log("Correct Repair Ids: ", correctRepairIds);
    console.log("Correct Front Screen Ids: ", correctFrontScreenIds);
    console.log("Correct Body Ids: ", correctBodyIds);
    console.log("Correct Accessories Ids: ", correctAccessoriesIds);

    const colorsArray = colors ? colors.split(',') : [];
    const storageSizesArray = storageSizes ? storageSizes.split(',') : [];
    const memorySizesArray = memorySizes ? memorySizes.split(',') : [];
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

    // Create new MacBook document with correct ObjectIDs
    const newMacBook = new MacBook({
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
      memorySizes: memorySizesArray.map(size => ({
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
      processorTypes: correctProcessorTypeIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      accessories: correctAccessoriesIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
    });

    // Save the new MacBook document
    await newMacBook.save();
    console.log('New MacBook saved to MongoDB:', newMacBook);
    return res.status(201).json(newMacBook);

  } catch (error) {
    console.error('Error adding MacBook:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    const {
      vendor, deviceType, modelName, maxPrice, colors, storageSizes, memorySizes ,paymentOptions,
      batteryHealth, cosmeticIssues, processorTypes ,faults, repairs, frontScreen, body, simVariant, pta, accessories, unknownParts
    } = req.body;

    // Find the existing MacBook document
    const existingMacBook = await MacBook.findById(req.params.id);
    if (!existingMacBook) {
      return res.status(404).json({ message: 'MacBook not found' });
    }

    // Parsing the passed data, only if values exist
    const parsedBatteryHealth = batteryHealth ? safeParse(batteryHealth) : existingMacBook.batteryHealth.map(opt => opt.option);
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : existingMacBook.cosmeticIssues.map(opt => opt.option);
    const parsedFaults = faults ? safeParse(faults) : existingMacBook.faults.map(opt => opt.option);
    const parsedRepairs = repairs ? safeParse(repairs) : existingMacBook.repairs.map(opt => opt.option);
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : existingMacBook.frontScreen.map(opt => opt.option);
    const parsedBody = body ? safeParse(body) : existingMacBook.body.map(opt => opt.option);
    const parsedProcessorTypes = processorTypes ? safeParse(processorTypes) : existingMacBook.processorTypes.map(opt => opt.option);
    const parsedAccessories = accessories ? safeParse(accessories) : existingMacBook.accessories.map(opt => opt.option);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctBatteryHealthIds = parsedBatteryHealth.length ? mapDynamicOptions(parsedBatteryHealth, options.batteryHealthOptions) : existingMacBook.batteryHealth.map(opt => opt.option);
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : existingMacBook.cosmeticIssues.map(opt => opt.option);
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : existingMacBook.faults.map(opt => opt.option);
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : existingMacBook.repairs.map(opt => opt.option);
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : existingMacBook.frontScreen.map(opt => opt.option);
    const correctBodyIds = parsedBody.length ? mapDynamicOptions(parsedBody, options.bodyOptions) : existingMacBook.body.map(opt => opt.option);
    const correctProcessorTypeIds = parsedProcessorTypes.length ? mapDynamicOptions(parsedProcessorTypes, options.processorTypesOptions) : existingMacBook.processorTypes.map(opt => opt.option);
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : existingMacBook.accessories.map(opt => opt.option);

    // Log mapped IDs for debugging
    console.log("Correct Fault Ids: ", correctFaultIds);
    console.log("Correct Cosmetic Issue Ids: ", correctCosmeticIssueIds);
    console.log("Correct Battery Health Ids: ", correctBatteryHealthIds);
    console.log("Correct Repair Ids: ", correctRepairIds);
    console.log("Correct Processor Type Ids: ", correctProcessorTypeIds);
    console.log("Correct Front Screen Ids: ", correctFrontScreenIds);
    console.log("Correct Body Ids: ", correctBodyIds);
    console.log("Correct Accessories Ids: ", correctAccessoriesIds);

    if (vendor) {
      existingMacBook.vendor = vendor;
    }
    if (deviceType) {
      existingMacBook.deviceType = deviceType;
    }
    if (modelName) {
      existingMacBook.modelName = modelName;
    }
    if (maxPrice) {
      existingMacBook.maxPrice = maxPrice;
    }

    // Handle colors and image uploads
    if (colors) {
      const colorsArray = colors.split(',');
      const updatedColors = await Promise.all(colorsArray.map(async (color) => {
        const existingColor = existingMacBook.colors.find(c => c.color === color);
        const uploadedImage = req.files.find(file => file.fieldname === `images_${color}`);
        let imageUrl = existingColor?.image || '';
        if (uploadedImage) {
          const fileName = `${modelName.replace(/\s/g, '_')}_${color}_${uuidv4()}`;
          imageUrl = await uploadToCloudinary(uploadedImage, fileName);
        }
        return { color, image: imageUrl };
      }));
      existingMacBook.colors = updatedColors;
    }

    // Handle storage sizes
    if (storageSizes) {
      const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
      existingMacBook.storageSizes = storageSizesArray.map(size => ({
        size,
        deductionPercentage: 0,
      }));
    }

    // Handle memory sizes
    if (memorySizes) {
      const memorySizesArray = Array.isArray(memorySizes) ? memorySizes : memorySizes.split(',');
      existingMacBook.memorySizes = memorySizesArray.map(size => ({
        size,
        deductionPercentage: 0,
      }));
    }

    if (paymentOptions) {
      existingMacBook.paymentOptions = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
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

    existingMacBook.batteryHealth = updateDeductionField(existingMacBook.batteryHealth, correctBatteryHealthIds);
    existingMacBook.cosmeticIssues = updateDeductionField(existingMacBook.cosmeticIssues, correctCosmeticIssueIds);
    existingMacBook.processorTypes = updateDeductionField(existingMacBook.processorTypes, correctProcessorTypeIds);
    existingMacBook.faults = updateDeductionField(existingMacBook.faults, correctFaultIds);
    existingMacBook.repairs = updateDeductionField(existingMacBook.repairs, correctRepairIds);
    existingMacBook.frontScreen = updateDeductionField(existingMacBook.frontScreen, correctFrontScreenIds);
    existingMacBook.body = updateDeductionField(existingMacBook.body, correctBodyIds);
    existingMacBook.accessories = updateDeductionField(existingMacBook.accessories, correctAccessoriesIds);

    // Save the updated MacBook document
    const updatedMacBook = await existingMacBook.save();
    return res.json(updatedMacBook);  // Return the updated MacBook

  } catch (error) {
    console.error('Error updating MacBook:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// PUT route to update device details for a specific MacBook model
router.put('/:id/device-details', async (req, res) => {
  try {
    const macbookId = req.params.id;
    const updateFields = req.body;  // Contains the updated deduction percentages for specific categories
    console.log('Received updateFields:', updateFields);

    // Fetch the MacBook document from the database
    const fetchedMacBook = await MacBook.findById(macbookId);
    if (!fetchedMacBook) {
      return res.status(404).json({ message: 'MacBook not found' });
    }

    // Log the existing fetchedMacBook document for debugging
    console.log('Existing MacBook Document:', fetchedMacBook);

    // Iterate over each category (like batteryHealth, cosmeticIssues, etc.) in updateFields
    for (const category in updateFields) {
      if (Array.isArray(updateFields[category])) {
        updateFields[category].forEach(updatedOption => {
          console.log('Updating category:', category, 'with option:', updatedOption);

          // Find the corresponding option in the existing fetchedMacBook document
          const existingOption = fetchedMacBook[category].find(option => option._id.toString() === updatedOption._id.toString());

          if (existingOption) {
            // Update the deduction percentage for the matched option
            existingOption.deductionPercentage = updatedOption.deductionPercentage;
          }
        });
      }
    }

    // Save the updated fetchedMacBook document
    await fetchedMacBook.save();

    res.json(fetchedMacBook);  // Return the updated document to the frontend
  } catch (error) {
    console.error('Error updating MacBook details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get all MacBooks or fetch by ID
router.get('/', async (req, res) => {
  try {
    const id = req.query.id; // Get the id from query parameters

    if (id) {
      console.log(`Fetching MacBook with ID: ${id}`);

      // Fetch MacBook data and populate the option fields with actual data by _id
      const fetchedMacBook = await MacBook
        .findById(id)
        .populate('batteryHealth.option', 'option')
        .populate('cosmeticIssues.option', 'header condition')
        .populate('faults.option', 'header condition')
        .populate('repairs.option', 'option')
        .populate('frontScreen.option', 'header condition')
        .populate('body.option', 'header condition')
        .populate('processorTypes.option', 'type cpuCores gpuCores speed') 
        .populate('accessories.option', 'option')

      console.log('Populated MacBook data:', JSON.stringify(fetchedMacBook, null, 2));

      if (fetchedMacBook) {
        res.json(fetchedMacBook);
      } else {
        res.status(404).json({ message: 'MacBook not found' });
      }
    } else {
      // Fetch all MacBooks if no ID is provided
      const MacBooks = await MacBook.find();
      res.json(MacBooks);
    }
  } catch (error) {
    console.error('Error retrieving MacBooks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get MacBook by modelName
router.get('/:modelName', async (req, res) => {
  try {
    const modelName = req.params.modelName;

    // Fetch MacBook data and populate the option fields with actual data
    const fetchedMacBook = await MacBook
      .findOne({ modelName })
      .populate('batteryHealth.option', 'option')  // Assuming option is the field in BatteryHealth
      .populate('cosmeticIssues.option', 'header condition')  // Assuming header and condition are fields in CosmeticIssues
      .populate('faults.option', 'header condition')  // Assuming header and condition are fields in Faults
      .populate('repairs.option', 'option')  // Assuming option is the field in Repairs
      .populate('frontScreen.option', 'header condition')  // Assuming header and condition are fields in FrontScreen
      .populate('processorTypes.option', 'type cpuCores gpuCores speed')  // Assuming type, cpuCores, gpuCores, and speed are fields in ProcessorTypes
      .populate('body.option', 'header condition')  // Assuming header and condition are fields in Back
      .populate('accessories.option', 'option')  // Assuming option is the field in Accessories

    if (!fetchedMacBook) {
      return res.status(404).json({ message: 'MacBook not found' });
    }

    res.json(fetchedMacBook);
  } catch (error) {
    console.error('Error retrieving MacBook:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to delete an MacBook by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMacBook = await MacBook.findByIdAndDelete(id);
    return deletedMacBook ? res.json({ message: 'MacBook deleted successfully' }) : res.status(404).json({ message: 'MacBook not found' });
  } catch (error) {
    console.error('Error deleting MacBook:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;