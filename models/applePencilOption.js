const mongoose = require('mongoose');

const ApplePencilSchema = new mongoose.Schema({
  generation: { type: String, required: true },
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
      deviceType: {
    type: String,
    enum: ['Smartphone', 'Tablet', 'Laptop', 'Smart Watch'], // Ensure valid device types
    required: true,
  },
});

module.exports = mongoose.model('ApplePencilOption', ApplePencilSchema);