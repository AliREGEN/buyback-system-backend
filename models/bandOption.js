const mongoose = require('mongoose');

const BandOptionSchema = new mongoose.Schema({
    option: { type: String, required: true, enum: ['Original Band', 'Aftermarket Band'] },
    deductionPercentage: { type: Number, default: 0 },
        deviceType: {
    type: String,
    enum: ['Smartphone', 'Tablet', 'Laptop', 'Smart Watch'], // Ensure valid device types
    required: true,
  },
});

module.exports = mongoose.model('BandOption', BandOptionSchema);