const mongoose = require('mongoose');

const PTASchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Is Your iPhone PTA Approved?', 'Is Your iPhone Factory Unlocked?', 'Is Your Phone Official PTA Approved?', 'Is Your Phone CPID Approved?', 'Is Your Phone Patched Approved?'] },
  deductionPercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model('PTAOption', PTASchema);
