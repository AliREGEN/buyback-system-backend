const mongoose = require('mongoose');

const FrontScreenSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
      deviceType: {
    type: String,
    enum: ['Smartphone', 'Tablet', 'Laptop', 'Smart Watch'], // Ensure valid device types
    required: true,
  },
});

module.exports = mongoose.model('FrontScreenOption', FrontScreenSchema);
