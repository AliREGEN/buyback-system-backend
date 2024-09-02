const mongoose = require('mongoose');

const PTASchema = new mongoose.Schema({
  option: {
    type: String,
    required: true,
    enum: ['Is your iPhone PTA Approved?', 'Is your iPhone Factory Unlocked?'],
  },
  deductionPercentage: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('PTA', PTASchema);
