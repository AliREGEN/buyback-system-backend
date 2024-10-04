const express = require('express');
const router = express.Router();
const PaymentOption = require('../models/paymentOption');

// Create Payment Option
router.post('/', async (req, res) => {
    try {
        const newOption = new PaymentOption(req.body);
        await newOption.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Payment Options
router.get('/', async (req, res) => {
    try {
        const options = await PaymentOption.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a Payment Option
router.put('/:id', async (req, res) => {
    try {
        const option = await PaymentOption.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(option);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a Payment Option
router.delete('/:id', async (req, res) => {
    try {
        await PaymentOption.findByIdAndDelete(req.params.id);
        res.json({ message: 'Payment Option deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
