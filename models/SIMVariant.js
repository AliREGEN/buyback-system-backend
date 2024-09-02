const mongoose = require('mongoose');

const SIMVariant = new mongoose.Schema({
  option: {
    type: String,
    required: true,
    enum: ['Dual eSIM', 'Dual Physical SIM', 'eSIM + Physical SIM'],
  },
  deductionPercentage: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('SIMVariant', SIMVariant);
