const mongoose = require('mongoose');

const AccessoriesSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Everything (Complete Box)', 'Box Only', 'iPhone Only', 'Phone Only', 'MacBook Only', 'iPad Only', 'Watch Only'] },
  deductionPercentage: { type: Number, default: 0 },
  deviceType: {
    type: String,
    enum: ['Smartphone', 'Tablet', 'Laptop', 'Smart Watch'], // Ensure valid device types
    required: true,
  },
});

module.exports = mongoose.model('AccessoriesOption', AccessoriesSchema);
