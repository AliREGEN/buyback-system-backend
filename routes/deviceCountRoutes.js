const express = require('express');
const router = express.Router();
const DeviceCount = require('../models/DeviceCount');

// GET route to fetch device count
router.get('/', async (req, res) => {
  try {
    let deviceCount = await DeviceCount.findOne();
    if (!deviceCount) {
      deviceCount = new DeviceCount();
      await deviceCount.save();
    }
    res.json({ count: deviceCount.count }); // Ensure you're returning the `count` field properly
  } catch (error) {
    res.status(500).json({ error: 'Error fetching device count' });
  }
});

// PATCH route to increment device count
router.patch('/increment', async (req, res) => {
  try {
    const deviceCount = await DeviceCount.findOne();
    if (!deviceCount) {
      return res.status(404).json({ message: 'Device count not found' });
    }

    deviceCount.count += req.body.increment || 1;
    await deviceCount.save();
    
    res.json({ message: 'Device count updated', deviceCount }); // Ensure the updated count is returned
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
