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

    const defaultBatteryHealth = [
        { health: '95% or Above', deductionPercentage: 0 },
        { health: '90% or Above', deductionPercentage: 0 },
        { health: '85% or Above', deductionPercentage: 0 },
        { health: '80% or Above', deductionPercentage: 0 },
        { health: 'Less than 80%', deductionPercentage: 0 },
        ];

    const defaultCosmeticIssues = [
      { header: 'Damaged Display', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/w5gsvgwfpkzpsx6k4an9' },
      { header: 'Damaged Camera Lens', condition: 'Cracked/Shattered', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/c_crop,g_auto,h_800,w_800/static/ytdbzp9swiq1ndj1ax9b.jpg' },
      { header: 'Damaged Body', condition: 'Broken/Bent', deductionPercentage: 0, image: '' }
    ];

    const paymentOptionsArray = Array.isArray(paymentOptions) ? paymentOptions : JSON.parse(paymentOptions || '[]');
    console.log('Payment Options Array: ', paymentOptionsArray);

    const defaultFaults = [
      { header: 'Faulty Display', condition: 'Dead Pixels/Spots/Lines', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/xypgkalx2bsb4fqvtrkx' },
      { header: 'Faulty Earpiece', condition: 'No Audio/Noisy Audio', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/a0wdieodeqzxalb2xxya' },
      { header: 'Faulty Face ID', condition: 'Face ID Not Working', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/q5cdb1z1grb3vlrjiwsl' },
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

    const defaultBody = [
      { header: 'Excellent', condition: 'Minimal Scratches', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/b5quxe8mxu91r78ezgn2' },
      { header: 'Good', condition: 'Few Scratches', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/iwwtuvg2au8briwxjk0f' },
      { header: 'Fair', condition: 'Visible Scratches', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/ry9g4aeoylpmqxmpdadx' },
      { header: 'Acceptable', condition: 'Deep Scratches', deductionPercentage: 0, image: 'https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/o7e92ahonlj1k76b1kjx' },
    ];

    const defaultAccessories = [
      { option: 'Everything (Complete Box)', deductionPercentage: 0, image: '' },
      { option: 'Box Only', deductionPercentage: 0, image: '' },
      { option: 'iPad Only', deductionPercentage: 0, image: '' }
    ];

    const defaultApplePencil = [
        { generation: '1st Generation', condition: 'Excellent', deductionPercentage: 0 },
        { generation: '1st Generation', condition: 'Good', deductionPercentage: 0 },
        { generation: '1st Generation', condition: 'Fair', deductionPercentage: 0 },
        { generation: '1st Generation', condition: 'Acceptable', deductionPercentage: 0 },
        { generation: '2nd Generation', condition: 'Excellent', deductionPercentage: 0 },
        { generation: '2nd Generation', condition: 'Good', deductionPercentage: 0 },
        { generation: '2nd Generation', condition: 'Fair', deductionPercentage: 0 },
        { generation: '2nd Generation', condition: 'Acceptable', deductionPercentage: 0 }
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
        batteryHealth: defaultBatteryHealth,
        cosmeticIssues: defaultCosmeticIssues,
        faults: defaultFaults,
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
router.put('/:id', upload.any(), async(req, res) => {
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

        if (vendor) existingIPad.vendor = vendor;
        if (deviceType) existingIPad.deviceType = deviceType;
        if (modelName) existingIPad.modelName = modelName;
        if (maxPrice) existingIPad.maxPrice = maxPrice;

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