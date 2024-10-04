const Watch = require('../models/Watch');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const BatteryHealth = require('../models/batteryHealthOption');
const CosmeticIssues = require('../models/cosmeticIssueOption');
const Faults = require('../models/faultOption');
const Repairs = require('../models/repairOption');
const FrontScreen = require('../models/frontScreenOption');
const Body = require('../models/bodyOption');
const Strap = require('../models/strapOption');
const Band = require('../models/bandOption');
const Accessories = require('../models/accessoriesOption');
const Connectivity = require('../models/connectivityOption');

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
  const faultsOptions = await Faults.find();
  const repairsOptions = await Repairs.find();
  const frontScreenOptions = await FrontScreen.find();
  const bodyOptions = await Body.find();
  const strapOptions = await Strap.find();
  const bandOptions = await Band.find();
  const accessoriesOptions = await Accessories.find();

  return {
    batteryHealthOptions,
    cosmeticIssuesOptions,
    connectivityOptions,
    faultsOptions,
    repairsOptions,
    frontScreenOptions,
    bodyOptions,
    strapOptions,
    bandOptions,
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

// Route to add a new Watch
router.post('/', upload.any(), async (req, res) => {
  try {

    const options = await fetchOptions();

    // Log options fetched from collections for debugging
    console.log('Available options:', options);

    const { vendor, deviceType, modelName, maxPrice, paymentOptions, watchCaseType, watchCaseFinish, watchCaseSize,
      batteryHealth, cosmeticIssues, faults, repairs, frontScreen, body, strap, band, accessories, connectivity
     } = req.body;

    const parsedBatteryHealth = batteryHealth ? safeParse(batteryHealth) : [];
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : [];
    const parsedConnectivity = connectivity ? safeParse(connectivity) : [];
    const parsedFaults = faults ? safeParse(faults) : [];
    const parsedRepairs = repairs ? safeParse(repairs) : [];
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : [];
    const parsedBody = body ? safeParse(body) : [];
    const parsedStrap = strap ? safeParse(strap) : [];
    const parsedBand = band ? safeParse(band) : [];
    const parsedAccessories = accessories ? safeParse(accessories) : [];

    const correctBatteryHealthIds = parsedBatteryHealth.length ? mapDynamicOptions(parsedBatteryHealth, options.batteryHealthOptions) : [];
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : [];
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : [];
    const correctConnectivityIds = parsedConnectivity.length ? mapDynamicOptions(parsedConnectivity, options.connectivityOptions) : [];
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : [];
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : [];
    const correctBodyIds = parsedBody.length ? mapDynamicOptions(parsedBody, options.bodyOptions) : [];
    const correctStrapIds = parsedStrap.length ? mapDynamicOptions(parsedStrap, options.strapOptions) : [];
    const correctBandIds = parsedBand.length ? mapDynamicOptions(parsedBand, options.bandOptions) : [];
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : [];

    const watchCaseFinishArray = watchCaseFinish ? watchCaseFinish.split(',') : [];
    const watchCaseSizeArray = watchCaseSize ? watchCaseSize.split(',') : [];
    const watchCaseTypeArray = watchCaseType ? watchCaseType.split(',') : [];
    let watchFinishArray = [];

    if (req.files && req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        const finishName = watchCaseFinishArray[i];
        const file = req.files[i];
        const fileName = `${modelName.replace(/\s/g, '_')}_${finishName}_${uuidv4()}`;
        const imageUrl = await uploadToCloudinary(file, fileName);
        watchFinishArray.push({ finish: finishName, image: imageUrl });
      }
    } else {
      watchFinishArray = watchCaseFinishArray.map(finish => ({ finish, image: null, }));
    }

    const newWatch = new Watch({
      id: uuidv4(),
      vendor,
      deviceType,
      modelName,
      maxPrice,
      watchCaseFinish: watchFinishArray,  
      watchCaseType: watchCaseTypeArray.map(type => ({ caseType: type, deductionPercentage: 0 })),
      watchCaseSize: watchCaseSizeArray.map(size => ({ size, deductionPercentage: 0 })),
      paymentOptions: Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]'),
      batteryHealth: correctBatteryHealthIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      cosmeticIssues: correctCosmeticIssueIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      faults: correctFaultIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      repairs: correctRepairIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      frontScreen: correctFrontScreenIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      body: correctBodyIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      strap: correctStrapIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      band: correctBandIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      accessories: correctAccessoriesIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
      connectivity: correctConnectivityIds.map(optionId => ({ option: optionId, deductionPercentage: 0 })),
    });

    await newWatch.save();
    console.log('New Watch saved to MongoDB: ', newWatch);
    return res.status(201).json(newWatch);
  } catch (error) {
    console.error('Error adding new Watch:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Route to update a Watch by ID
router.put('/:id', upload.any(), async (req, res) => {
  try {
    // Fetch options dynamically from their respective collections
    const options = await fetchOptions();

    const {
      vendor, deviceType, modelName, maxPrice, watchCaseFinish, watchCaseSize, watchCaseType ,paymentOptions,
      batteryHealth, cosmeticIssues, connectivity ,faults, repairs, frontScreen, body, strap, accessories, band,
    } = req.body;

    // Find the existing Watch document
    const existingWatch = await Watch.findById(req.params.id);
    if (!existingWatch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    // Parsing the passed data, only if values exist
    const parsedBatteryHealth = batteryHealth ? safeParse(batteryHealth) : existingWatch.batteryHealth.map(opt => opt.option);
    const parsedCosmeticIssues = cosmeticIssues ? safeParse(cosmeticIssues) : existingWatch.cosmeticIssues.map(opt => opt.option);
    const parsedConnectivity = connectivity ? safeParse(connectivity) : existingWatch.connectivity.map(opt => opt.option);
    const parsedFaults = faults ? safeParse(faults) : existingWatch.faults.map(opt => opt.option);
    const parsedRepairs = repairs ? safeParse(repairs) : existingWatch.repairs.map(opt => opt.option);
    const parsedFrontScreen = frontScreen ? safeParse(frontScreen) : existingWatch.frontScreen.map(opt => opt.option);
    const parsedBody = body ? safeParse(body) : existingWatch.body.map(opt => opt.option);
    const parsedStrap = strap ? safeParse(strap) : existingWatch.strap.map(opt => opt.option);
    const parsedBand = band ? safeParse(band) : existingWatch.band.map(opt => opt.option);
    const parsedAccessories = accessories ? safeParse(accessories) : existingWatch.accessories.map(opt => opt.option);

    // Mapping the parsed data to correct ObjectIds, only if the field exists
    const correctBatteryHealthIds = parsedBatteryHealth.length ? mapDynamicOptions(parsedBatteryHealth, options.batteryHealthOptions) : existingWatch.batteryHealth.map(opt => opt.option);
    const correctCosmeticIssueIds = parsedCosmeticIssues.length ? mapDynamicOptions(parsedCosmeticIssues, options.cosmeticIssuesOptions) : existingWatch.cosmeticIssues.map(opt => opt.option);
    const correctFaultIds = parsedFaults.length ? mapDynamicOptions(parsedFaults, options.faultsOptions) : existingWatch.faults.map(opt => opt.option);
    const correctRepairIds = parsedRepairs.length ? mapDynamicOptions(parsedRepairs, options.repairsOptions) : existingWatch.repairs.map(opt => opt.option);
    const correctFrontScreenIds = parsedFrontScreen.length ? mapDynamicOptions(parsedFrontScreen, options.frontScreenOptions) : existingWatch.frontScreen.map(opt => opt.option);
    const correctBodyIds = parsedBody.length ? mapDynamicOptions(parsedBody, options.bodyOptions) : existingWatch.body.map(opt => opt.option);
    const correctStrapIds = parsedStrap.length ? mapDynamicOptions(parsedStrap, options.strapOptions) : existingWatch.strap.map(opt => opt.option);
    const correctBandIds = parsedBand.length ? mapDynamicOptions(parsedBand, options.bandOptions) : existingWatch.band.map(opt => opt.option);
    const correctAccessoriesIds = parsedAccessories.length ? mapDynamicOptions(parsedAccessories, options.accessoriesOptions) : existingWatch.accessories.map(opt => opt.option);
    const correctConnectivityIds = parsedConnectivity.length ? mapDynamicOptions(parsedConnectivity, options.connectivityOptions) : existingWatch.connectivity.map(opt => opt.option);


    if (vendor) {
      existingWatch.vendor = vendor;
    }
    if (deviceType) {
      existingWatch.deviceType = deviceType;
    }
    if (modelName) {
      existingWatch.modelName = modelName;
    }
    if (maxPrice) {
      existingWatch.maxPrice = maxPrice;
    }

    // Handle colors and image uploads
    if (watchCaseFinish) {
      const finishArray = watchCaseFinish.split(',');
      const updatedFinish = await Promise.all(finishArray.map(async (finish) => {
        const existingFinish = existingWatch.watchCaseFinish.find(c => c.finish === finish);
        const uploadedImage = req.files.find(file => file.feildname === `images_${finish}`);
        let imageUrl = existingFinish?.image || '';
        if (uploadedImage) {
          const fileName = `${modelName.replace(/\s/g, '_')}_${finish}_${uuidv4()}`;
          imageUrl = await uploadToCloudinary(uploadedImage, fileName);
        }
        return { finish, image: imageUrl };
      }));
      existingWatch.watchCaseFinish = updatedFinish;
    }

    // Handle storage sizes
    if (watchCaseSize) {
      const sizeArray = Array.isArray(watchCaseSize) ? watchCaseSize : watchCaseSize.split(',');
      existingWatch.watchCaseSize = sizeArray.map(size => ({
        size,
        deductionPercentage: 0
      }));
    }

    // Handle case types
    if (watchCaseType) {
      const typeArray = Array.isArray(watchCaseType) ? watchCaseType : watchCaseType.split(',');
      existingWatch.watchCaseType = typeArray.map(caseType => ({
        caseType,
        deductionPercentage: 0
      }));
    }

    if (paymentOptions) {
      existingWatch.paymentOptions = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
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

    existingWatch.batteryHealth = updateDeductionField(existingWatch.batteryHealth, correctBatteryHealthIds);
    existingWatch.cosmeticIssues = updateDeductionField(existingWatch.cosmeticIssues, correctCosmeticIssueIds);
    existingWatch.faults = updateDeductionField(existingWatch.faults, correctFaultIds);
    existingWatch.repairs = updateDeductionField(existingWatch.repairs, correctRepairIds);
    existingWatch.frontScreen = updateDeductionField(existingWatch.frontScreen, correctFrontScreenIds);
    existingWatch.body = updateDeductionField(existingWatch.body, correctBodyIds);
    existingWatch.strap = updateDeductionField(existingWatch.strap, correctStrapIds);
    existingWatch.band = updateDeductionField(existingWatch.band, correctBandIds);
    existingWatch.connectivity = updateDeductionField(existingWatch.connectivity, correctConnectivityIds);
    existingWatch.accessories = updateDeductionField(existingWatch.accessories, correctAccessoriesIds);

    // Save the updated Watch document
    const updatedWatch = await existingWatch.save();
    return res.json(updatedWatch);  // Return the updated Watch

  } catch (error) {
    console.error('Error updating Watch:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id/device-details', async (req, res) => {
  try {
    const watchId = req.params.id;
    const updateFields = req.body;  // Contains the updated deduction percentages for specific categories
    console.log('Received updateFields:', updateFields);

    // Fetch the Watch document from the database
    const fetchedWatch = await Watch.findById(watchId);
    if (!fetchedWatch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    // Log the existing fetchedWatch document for debugging
    console.log('Existing Watch Document:', fetchedWatch);

    // Iterate over each category (like batteryHealth, cosmeticIssues, etc.) in updateFields
    for (const category in updateFields) {
      if (Array.isArray(updateFields[category])) {
        updateFields[category].forEach(updatedOption => {
          console.log('Updating category:', category, 'with option:', updatedOption);

          // Find the corresponding option in the existing fetchedWatch document
          const existingOption = fetchedWatch[category].find(option => option._id.toString() === updatedOption._id.toString());

          if (existingOption) {
            // Update the deduction percentage for the matched option
            existingOption.deductionPercentage = updatedOption.deductionPercentage;
          }
        });
      }
    }

    // Save the updated fetchedWatch document
    await fetchedWatch.save();

    res.json(fetchedWatch);  // Return the updated document to the frontend
  } catch (error) {
    console.error('Error updating Watch details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get all Watches or fetch by ID
router.get('/', async (req, res) => {
  try {
    const id = req.query.id; // Get the id from query parameters

    if (id) {
      console.log(`Fetching Watch with ID: ${id}`);

      // Fetch Watch data and populate the option fields with actual data by _id
      const fetchedWatch = await Watch
        .findById(id)
        .populate('batteryHealth.option', 'option')
        .populate('cosmeticIssues.option', 'header condition')
        .populate('faults.option', 'header condition')
        .populate('repairs.option', 'option')
        .populate('frontScreen.option', 'header condition')
        .populate('body.option', 'header condition')
        .populate('strap.option', 'header condition')
        .populate('band.option', 'option')
        .populate('connectivity.option', 'option')
        .populate('accessories.option', 'option')

      console.log('Populated Watch data:', JSON.stringify(fetchedWatch, null, 2));

      if (fetchedWatch) {
        res.json(fetchedWatch);
      } else {
        res.status(404).json({ message: 'Watch not found' });
      }
    } else {
      // Fetch all Watchs if no ID is provided
      const Watchs = await Watch.find();
      res.json(Watchs);
    }
  } catch (error) {
    console.error('Error retrieving Watchs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get Watch by model name
router.get('/:modelName', async (req, res) => {
  try {
    const modelName = req.params.modelName;

    // Fetch Watch data and populate the option fields with actual data
    const fetchedWatch = await Watch
      .findOne({ modelName })
        .populate('batteryHealth.option', 'option')
        .populate('cosmeticIssues.option', 'header condition')
        .populate('faults.option', 'header condition')
        .populate('repairs.option', 'option')
        .populate('frontScreen.option', 'header condition')
        .populate('body.option', 'header condition')
        .populate('strap.option', 'header condition')
        .populate('band.option', 'option')
        .populate('connectivity.option', 'option')
        .populate('accessories.option', 'option')

    if (!fetchedWatch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    res.json(fetchedWatch);
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
    return deletedWatch ? res.json({ message: 'Watch deleted successfully' }) : res.status(404).json({ message: 'Watch not found' });
  } catch (error) {
    console.error('Error deleting Watch:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
