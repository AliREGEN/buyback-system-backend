const mongoose = require('mongoose');

const SIMVariantSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Dual eSIM', 'Dual Physical SIM', 'eSIM + Physical SIM'] },
  deductionPercentage: { type: Number, default: 0 },
      deviceType: {
    type: String,
    enum: ['Smartphone', 'Tablet', 'Laptop', 'Smart Watch'], // Ensure valid device types
    required: true,
  },
});

module.exports = mongoose.model('SIMVariantOption', SIMVariantSchema);
