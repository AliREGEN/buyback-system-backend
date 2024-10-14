const mongoose = require('mongoose');

const ActivatedSinceSchema = new mongoose.Schema({
    option: { type: String, required: true},
    deductionPercentage: { type: Number, default: 0},
    deviceType: {
    type: String,
    enum: ['Smartphone', 'Tablet', 'Laptop', 'Smart Watch'], // Ensure valid device types
    required: true,
  },
})

module.exports = mongoose.model('ActivatedSinceOption', ActivatedSinceSchema);