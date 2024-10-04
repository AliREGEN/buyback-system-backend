const mongoose = require('mongoose');
const Samsung = require('../models/Samsung');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const CosmeticIssues = require('../models/cosmeticIssueOption');
const Faults = require('../models/faultOption');
const Repairs = require('../models/repairOption');
const FrontScreen = require('../models/frontScreenOption');
const Back = require('../models/backOption');
const Side = require('../models/sideOption');
const SIMVariant = require('../models/simVariantOption');
const PTA = require('../models/ptaOption');
const Accessories = require('../models/accessoriesOption');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        folder: 'samsung_images',
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

const fetchOptions = async () => {
  const cosmeticIssuesOptions = await CosmeticIssues.find();
  const faultsOptions = await Faults.find();
  const repairsOptions = await Repairs.find();
  const frontScreenOptions = await FrontScreen.find();
  const backOptions = await Back.find();
  const sideOptions = await Side.find();
  const simVariantOptions = await SIMVariant.find();
  const ptaOptions = await PTA.find();
  const accessoriesOptions = await Accessories.find();

  return {
    cosmeticIssuesOptions,
    faultsOptions,
    repairsOptions,
    frontScreenOptions,
    backOptions,
    sideOptions,
    simVariantOptions,
    ptaOptions,
    accessoriesOptions,
  };
};

// Route to add a new Samsung phone
router.post('/', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    // Log options fetched from collections for debugging
    console.log('Available options:', options);

    const {
      vendor, deviceType, modelName, maxPrice, colors, storageSizes, paymentOptions, cosmeticIssues, faults, repairs, frontScreen, back, side, simVariant, pta, accessories
    } = req.body;

    // Parsing the passed data, only if values exist
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : [];
    const parsedFaults = faults ? safeParse(faults) : [];
    const parsedRepairs = repairs ? safeParse(repairs) : [];
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : [];
    const parsedBack = back ? safeParse(back) : [];
    const parsedSide = side ? safeParse(side) : [];
    const parsedSimVariant = simVariant ? safeParse(simVariant) : [];
    const parsedPta = pta ? safeParse(pta) : [];
    const parsedAccessories = accessories ? safeParse(accessories) : [];

    // Log parsed data for debugging
    console.log('Parsed Cosmetic Issues:', parsedCosmeticIssues);
    console.log('Parsed Faults:', parsedFaults);
    console.log('Parsed Repairs:', parsedRepairs);
    console.log('Parsed Front Screen:', parsedFrontScreen);
    console.log('Parsed Back:', parsedBack);
    console.log('Parsed Side:', parsedSide);
    console.log('Parsed SIM Variant:', parsedSimVariant);
    console.log('Parsed PTA:', parsedPta);
    console.log('Parsed Accessories:', parsedAccessories);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : [];
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : [];
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : [];
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : [];
    const correctBackIds = parsedBack.length ? mapDynamicOptions(parsedBack, options.backOptions) : [];
    const correctSideIds = parsedSide.length ? mapDynamicOptions(parsedSide, options.sideOptions) : [];
    const correctSimVariantIds = parsedSimVariant.length ? mapDynamicOptions(parsedSimVariant, options.simVariantOptions) : [];
    const correctPtaIds = parsedPta.length ? mapDynamicOptions(parsedPta, options.ptaOptions) : [];
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : [];

    // Log mapped IDs for debugging
    console.log("Correct Fault Ids: ", correctFaultIds);
    console.log("Correct Cosmetic Issue Ids: ", correctCosmeticIssueIds);
    console.log("Correct Repair Ids: ", correctRepairIds);
    console.log("Correct Front Screen Ids: ", correctFrontScreenIds);
    console.log("Correct Back Ids: ", correctBackIds);
    console.log("Correct Side Ids: ", correctSideIds);
    console.log("Correct SIM Variant Ids: ", correctSimVariantIds);
    console.log("Correct PTA Ids: ", correctPtaIds);
    console.log("Correct Accessories Ids: ", correctAccessoriesIds);

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

    // Create new Samsung document with correct ObjectIDs
    const newSamsung = new Samsung({
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
      cosmeticIssues: correctCosmeticIssueIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      faults: correctFaultIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      repairs: correctRepairIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      frontScreen: correctFrontScreenIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      back: correctBackIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      side: correctSideIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      simVariant: correctSimVariantIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      pta: correctPtaIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      accessories: correctAccessoriesIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
    });

    // Save the new Samsung document
    await newSamsung.save();
    console.log('New Samsung saved to MongoDB:', newSamsung);
    return res.status(201).json(newSamsung);

  } catch (error) {
    console.error('Error adding Samsung:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// update a Samsung phone
router.put('/:id', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    const {
      vendor, deviceType, modelName, maxPrice, colors, storageSizes, paymentOptions,
     cosmeticIssues, faults, repairs, frontScreen, back, side, simVariant, pta, accessories
    } = req.body;

    // Find the existing Samsung document
    const existingSamsung = await Samsung.findById(req.params.id);
    if (!existingSamsung) {
      return res.status(404).json({ message: 'Samsung Phone not found' });
    }

    // Parsing the passed data, only if values exist
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : existingSamsung.cosmeticIssues.map(opt => opt.option);
    const parsedFaults = faults ? safeParse(faults) : existingSamsung.faults.map(opt => opt.option);
    const parsedRepairs = repairs ? safeParse(repairs) : existingSamsung.repairs.map(opt => opt.option);
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : existingSamsung.frontScreen.map(opt => opt.option);
    const parsedBack = back ? safeParse(back) : existingSamsung.back.map(opt => opt.option);
    const parsedSide = side ? safeParse(side) : existingSamsung.side.map(opt => opt.option);
    const parsedSimVariant = simVariant ? safeParse(simVariant) : existingSamsung.simVariant.map(opt => opt.option);
    const parsedPta = pta ? safeParse(pta) : existingSamsung.pta.map(opt => opt.option);
    const parsedAccessories = accessories ? safeParse(accessories) : existingSamsung.accessories.map(opt => opt.option);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : existingSamsung.cosmeticIssues.map(opt => opt.option);
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : existingSamsung.faults.map(opt => opt.option);
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : existingSamsung.repairs.map(opt => opt.option);
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : existingSamsung.frontScreen.map(opt => opt.option);
    const correctBackIds = parsedBack.length ? mapDynamicOptions(parsedBack, options.backOptions) : existingSamsung.back.map(opt => opt.option);
    const correctSideIds = parsedSide.length ? mapDynamicOptions(parsedSide, options.sideOptions) : existingSamsung.side.map(opt => opt.option);
    const correctSimVariantIds = parsedSimVariant.length ? mapDynamicOptions(parsedSimVariant, options.simVariantOptions) : existingSamsung.simVariant.map(opt => opt.option);
    const correctPtaIds = parsedPta.length ? mapDynamicOptions(parsedPta, options.ptaOptions) : existingSamsung.pta.map(opt => opt.option);
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : existingSamsung.accessories.map(opt => opt.option);

    // Log mapped IDs for debugging
    console.log("Correct Fault Ids: ", correctFaultIds);
    console.log("Correct Cosmetic Issue Ids: ", correctCosmeticIssueIds);
    console.log("Correct Repair Ids: ", correctRepairIds);
    console.log("Correct Front Screen Ids: ", correctFrontScreenIds);
    console.log("Correct Back Ids: ", correctBackIds);
    console.log("Correct Side Ids: ", correctSideIds);
    console.log("Correct SIM Variant Ids: ", correctSimVariantIds);
    console.log("Correct PTA Ids: ", correctPtaIds);
    console.log("Correct Accessories Ids: ", correctAccessoriesIds);

    if (vendor) {
      existingSamsung.vendor = vendor;
    }
    if (deviceType) {
      existingSamsung.deviceType = deviceType;
    }
    if (modelName) {
      existingSamsung.modelName = modelName;
    }
    if (maxPrice) {
      existingSamsung.maxPrice = maxPrice;
    }

    // Handle colors and image uploads
    if (colors) {
      const colorsArray = colors.split(',');
      const updatedColors = await Promise.all(colorsArray.map(async (color) => {
        const existingColor = existingSamsung.colors.find(c => c.color === color);
        const uploadedImage = req.files.find(file => file.fieldname === `images_${color}`);
        let imageUrl = existingColor?.image || '';
        if (uploadedImage) {
          const fileName = `${modelName.replace(/\s/g, '_')}_${color}_${uuidv4()}`;
          imageUrl = await uploadToCloudinary(uploadedImage, fileName);
        }
        return { color, image: imageUrl };
      }));
      existingSamsung.colors = updatedColors;
    }

    // Handle storage sizes
    if (storageSizes) {
      const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
      existingSamsung.storageSizes = storageSizesArray.map(size => ({
        size,
        deductionPercentage: 0,
      }));
    }

    if (paymentOptions) {
      existingSamsung.paymentOptions = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
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

    existingSamsung.cosmeticIssues = updateDeductionField(existingSamsung.cosmeticIssues, correctCosmeticIssueIds);
    existingSamsung.faults = updateDeductionField(existingSamsung.faults, correctFaultIds);
    existingSamsung.repairs = updateDeductionField(existingSamsung.repairs, correctRepairIds);
    existingSamsung.frontScreen = updateDeductionField(existingSamsung.frontScreen, correctFrontScreenIds);
    existingSamsung.back = updateDeductionField(existingSamsung.back, correctBackIds);
    existingSamsung.side = updateDeductionField(existingSamsung.side, correctSideIds);
    existingSamsung.simVariant = updateDeductionField(existingSamsung.simVariant, correctSimVariantIds);
    existingSamsung.pta = updateDeductionField(existingSamsung.pta, correctPtaIds);
    existingSamsung.accessories = updateDeductionField(existingSamsung.accessories, correctAccessoriesIds);

    // Save the updated Samsung document
    const updatedSamsung = await existingSamsung.save();
    return res.json(updatedSamsung);  // Return the updated Samsung

  } catch (error) {
    console.error('Error updating Samsung:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id/device-details', async (req, res) => {
  try {
    const samsungId = req.params.id;
    const updateFields = req.body;  // Contains the updated deduction percentages for specific categories
    console.log('Received updateFields:', updateFields);

    // Fetch the Samsung document from the database
    const fetchedSamsung = await Samsung.findById(samsungId);
    if (!fetchedSamsung) {
      return res.status(404).json({ message: 'Samsung not found' });
    }

    // Log the existing fetchedSamsung document for debugging
    console.log('Existing Samsung Document:', fetchedSamsung);

    // Iterate over each category (like batteryHealth, cosmeticIssues, etc.) in updateFields
    for (const category in updateFields) {
      if (Array.isArray(updateFields[category])) {
        updateFields[category].forEach(updatedOption => {
          console.log('Updating category:', category, 'with option:', updatedOption);

          // Find the corresponding option in the existing fetchedSamsung document
          const existingOption = fetchedSamsung[category].find(option => option._id.toString() === updatedOption._id.toString());

          if (existingOption) {
            // Update the deduction percentage for the matched option
            existingOption.deductionPercentage = updatedOption.deductionPercentage;
          }
        });
      }
    }

    // Save the updated fetchedSamsung document
    await fetchedSamsung.save();

    res.json(fetchedSamsung);  // Return the updated document to the frontend
  } catch (error) {
    console.error('Error updating Samsung details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Route to get all Samsung or fetch by ID
router.get('/', async (req, res) => {
  try {
    const id = req.query.id; // Get the id from query parameters

    if (id) {
      console.log(`Fetching Samsung with ID: ${id}`);

      // Fetch Samsung data and populate the option fields with actual data by _id
      const fetchedSamsung = await Samsung
        .findById(id)
        .populate('cosmeticIssues.option', 'header condition')
        .populate('faults.option', 'header condition')
        .populate('repairs.option', 'option')
        .populate('frontScreen.option', 'header condition')
        .populate('back.option', 'header condition')
        .populate('side.option', 'header condition')
        .populate('simVariant.option', 'option')
        .populate('pta.option', 'option')
        .populate('accessories.option', 'option')

      console.log('Populated Samsung data:', JSON.stringify(fetchedSamsung, null, 2));

      if (fetchedSamsung) {
        res.json(fetchedSamsung);
      } else {
        res.status(404).json({ message: 'Samsung not found' });
      }
    } else {
      // Fetch all Samsungs if no ID is provided
      const Samsungs = await Samsung.find();
      res.json(Samsungs);
    }
  } catch (error) {
    console.error('Error retrieving Samsungs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get Samsung by Model Name
router.get('/:modelName', async (req, res) => {
  try {
    const modelName = req.params.modelName;

    // Fetch Samsung data and populate the option fields with actual data
    const fetchedSamsung = await Samsung
      .findOne({ modelName })
      .populate('cosmeticIssues.option', 'header condition')  // Assuming header and condition are fields in CosmeticIssues
      .populate('faults.option', 'header condition')  // Assuming header and condition are fields in Faults
      .populate('repairs.option', 'option')  // Assuming option is the field in Repairs
      .populate('frontScreen.option', 'header condition')  // Assuming header and condition are fields in FrontScreen
      .populate('back.option', 'header condition')  // Assuming header and condition are fields in Back
      .populate('side.option', 'header condition')  // Assuming header and condition are fields in Side
      .populate('simVariant.option', 'option')  // Assuming option is the field in SIMVariant
      .populate('pta.option', 'option')  // Assuming option is the field in PTA
      .populate('accessories.option', 'option')  // Assuming option is the field in Accessories

    if (!fetchedSamsung) {
      return res.status(404).json({ message: 'Samsung not found' });
    }

    res.json(fetchedSamsung);
  } catch (error) {
    console.error('Error retrieving Samsung:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to delete an Samsung by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedSamsung = await Samsung.findByIdAndDelete(id);
    return deletedSamsung ? res.json({ message: 'Samsung deleted successfully' }) : res.status(404).json({ message: 'Samsung not found' });
  } catch (error) {
    console.error('Error deleting Samsung:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;