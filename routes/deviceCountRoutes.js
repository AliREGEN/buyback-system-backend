const express = require('express');
const router = express.Router();
const DeviceCount = require('../models/deviceCount');

router.get('/', async (req, res) => {
  try {
    let deviceCount = await DeviceCount.findOne();
    if (!deviceCount) {
      deviceCount = new DeviceCount();
      await deviceCount.save();
    }
    res.json(deviceCount);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching device count' });
  }
});

router.patch('/increment', async (req, res) => {
  try {
    const deviceCount = await DeviceCount.findOne();
    if (!deviceCount) {
      return res.status(404).json({ message: 'Device count not found' });
    }

    deviceCount.count += req.body.increment || 1;
    await deviceCount.save();
    
    res.json({ message: 'Device count updated', deviceCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
