const Samsung = require('../models/Samsung');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

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

// Route to add a new Samsung phone
router.post('/', upload.any(), async (req, res) => {
    try {
        console.log('Received Body: ', req.body);
        console.log('Received Files: ', req.files);

        const { vendor, deviceType, modelName, maxPrice, colors, storageSizes, paymentOptions } = req.body;

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

    const defaultCosmeticIssues = [
      { header: 'Damaged Display', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/w5gsvgwfpkzpsx6k4an9' },
      { header: 'Damaged Back', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/mcoj9bvjccs3k3sbs0zo' },
      { header: 'Damaged Camera Lens', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/c_crop,g_auto,h_800,w_800/static/ytdbzp9swiq1ndj1ax9b.jpg' },
      { header: 'Damaged Frame', condition: 'Broken/Bent', deductionPercentage: 0, image: '' }
    ];

    const paymentOptionsArray = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
    console.log('Payment Options Array: ', paymentOptionsArray);


    const defaultFaults = [
      { header: 'Faulty Display', condition: 'Dead Pixels/Spots/Lines', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/xypgkalx2bsb4fqvtrkx' },
      { header: 'Faulty Earpiece', condition: 'No Audio/Noisy Audio', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/a0wdieodeqzxalb2xxya' },
      { header: 'Faulty Face ID', condition: 'Face ID Not Working', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/q5cdb1z1grb3vlrjiwsl' },
      { header: 'Faulty In-Display Fingerprint Sensor', condition: 'Not Working/Slow', deductionPercentage: 0, image: '' },
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
      { header: 'Excellent', condition: '1 - 2 hardly visible scratches or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no deep scratches', deductionPercentage: 0},
      { header: 'Fair', condition: 'Visible scratches, swirls, 1 - 2 minor deep scratches', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Too many scratches, swirls, noticeable deep scratches', deductionPercentage: 0 },
    ];

    const defaultBack = [
      { header: 'Excellent', condition: '1 - 2 hardly visible scratches or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no deep scratches', deductionPercentage: 0},
      { header: 'Fair', condition: 'Visible scratches, swirls, 1 - 2 minor deep scratches', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Too many scratches, swirls, noticeable deep scratches', deductionPercentage: 0 },
    ];

    const defaultSide = [
      { header: 'Excellent', condition: '1 - 2 hardly visible scratches or minimal signs of use', deductionPercentage: 0 },
      { header: 'Good', condition: 'Some visible signs of usage, but no scuffs or dents', deductionPercentage: 0},
      { header: 'Fair', condition: 'Visible scratches, 1 - 2 minor scuffs or dents', deductionPercentage: 0 },
      { header: 'Acceptable', condition: 'Too many scratches, noticeable scuffs or dents', deductionPercentage: 0 },
    ];

    const defaultSIMVariant = [
      { option: 'Dual Physical SIM', deductionPercentage: 0 },
      { option: 'eSIM + Physical SIM', deductionPercentage: 0 }
    ];

    const defaultPTA = [
      { option: 'Is Your Phone Official PTA Approved?', deductionPercentage: 0 },
      { option: 'Is Your Phone CPID Approved?', deductionPercentage: 0 },
      { option: 'Is Your Phone Patched?', deductionPercentage: 0 }      
    ];

    const defaultAccessories = [
      { option: 'Everything (Complete Box)', deductionPercentage: 0, image: '' },
      { option: 'Box Only', deductionPercentage: 0, image: '' },
      { option: 'Phone Only', deductionPercentage: 0, image: '' }
    ];

    const newSamsung = new Samsung({
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

    await newSamsung.save();
    console.log('New Samsung Phone Added: ', newSamsung);
    return res.status(201).json(newSamsung);
    } catch (error) {
        console.error('Error Adding Samsung Phone: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// update a Samsung phone
router.put('/:id', upload.any(), async (req, res) => {
    try {
        const {
            vendor,
            deviceType,
            modelName,
            maxPrice,
            colors,
            storageSizes,
            paymentOptions,
            cosmeticIssues,
            faults,
            repairs,
            frontScreen,
            back,
            side,
            simVariant,
            pta,
            accessories,
        } = req.body;

        const existingSamsung = await Samsung.findById(req.params.id);
        if (!existingSamsung) {
            return res.status(404).json({ error: 'Samsung Phone not found' });
        }

        console.log('Received Body: ', req.body);
        console.log('Received Files: ', req.files);

        if (vendor) existingSamsung.vendor = vendor;
        if (deviceType) existingSamsung.deviceType = deviceType;
        if (modelName) existingSamsung.modelName = modelName;
        if (maxPrice) existingSamsung.maxPrice = maxPrice;

        if (colors) {
            const colorsArray = colors.split(',');

            const updatedColors = await Promise.all(colorsArray.map(async (color) =>{
                const existingColor = existingSamsung.colors.find(c => c.color === color);
                const uploadedImage = req.files.find(file => file.fieldname === `images_${color}`);

                console.log(`Processing color: ${color}, existingColor: ${existingColor ? existingColor.color : 'N/A'}`);

                let imageUrl = existingColor?.image || '';

                if (uploadedImage) {
                    console.log(`Uploading image for color: ${color}`);
                    const fileName = `${modelName.replace(/\s/g, '_')}_${color}_${uuidv4()}`;
                    imageUrl = await uploadToCloudinary(uploadedImage, fileName);
                    console.log(`Uploaded image for color: ${color}, URL: ${imageUrl}`);
                }
                return { color, image: imageUrl };
            }));

            existingSamsung.colors = updatedColors;
        }

        if (storageSizes) {
            const storageSizesArray = Array.isArray(storageSizes) ? storageSizes : storageSizes.split(',');
            existingSamsung.storageSizes = storageSizesArray.map(size => ({
                size: typeof size === 'object' ? size.size : size,
                deductionPercentage: size.deductionPercentage || 0,
            }));
        }

        if (paymentOptions) 
        {
            const paymentOptionsArray = Array.isArray(paymentOptions)
            ? paymentOptions
            : JSON.parse(paymentOptions);

            existingSamsung.paymentOptions = paymentOptionsArray.map(item => ({
                option: item.option,
                deductionPercentage: item.deductionPercentage || 0,
            }));
        }

        // Update cosmetic issues
    if (Array.isArray(cosmeticIssues)) {
      existingSamsung.cosmeticIssues = cosmeticIssues.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update faults
    if (Array.isArray(faults)) {
      existingSamsung.faults = faults.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update repairs
    if (Array.isArray(repairs)) {
      existingSamsung.repairs = repairs.map(item => ({
        repair: item.repair,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update front screen
    if (Array.isArray(frontScreen)) {
      existingSamsung.frontScreen = frontScreen.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update back
    if (Array.isArray(back)) {
      existingSamsung.back = back.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update side
    if (Array.isArray(side)) {
      existingSamsung.side = side.map(item => ({
        header: item.header,
        condition: item.condition,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    // Update simVariant
    if (Array.isArray(simVariant)) {
      existingSamsung.simVariant = simVariant.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    // Update PTA
    if (Array.isArray(pta)) {
      existingSamsung.pta = pta.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
      }));
    }

    // Update accessories
    if (Array.isArray(accessories)) {
      existingSamsung.accessories = accessories.map(item => ({
        option: item.option,
        deductionPercentage: item.deductionPercentage || 0,
        image: item.image || '',
      }));
    }

    const updatedSamsung = await existingSamsung.save();
    res.json(updatedSamsung);
    } catch (error) {
        console.error('Error updating Samsung: ', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to get all Samsung or fetch by ID
router.get('/', async (req, res) => {
    try {
        const id = req.query.id;

        if (id) {
            console.log(`Fetched Samsung with ID:  ${id}`);
            const fetchedSamsung = await Samsung.findOne({ id: id });

            if (fetchedSamsung) {
                res.json(fetchedSamsung);
            } else {
                res.status(404).json({ message: 'Samsung Phone not found'});
            }
        } else {
            const Samsungs = await Samsung.find();
            res.json(Samsungs);
        }
    } catch (error) {
        console.error('Error retrieving Samsung: ', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to get Samsung by Model Name
router.get('/:modelName', async (req, res) => {
    try {
        const modelName = req.params.modelName;
        if (!modelName) {
            return res.status(400).json({ message: 'Model name is required' });
        }

        const fetchedSamsung = await Samsung.findOne({ modelName });
        if (!fetchedSamsung) {
            return res.status(404).json({ message: 'Samsung Not Found' });
        }
        res.json(fetchedSamsung);
    } catch (error) {
        console.error('Error retrieving Samsung: ', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to delete an Samsung by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedSamsung = await Samsung.findByIdAndDelete(id);

        if (!deletedSamsung) {
            return res.status(404).json({ message: 'Samsung Phone Found!' });
        }
        res.json({ message: 'Samsung deleted successfully' });
    } catch (error) {
        console.error('Error deleting Samsung: ', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;