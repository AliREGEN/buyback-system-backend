const mongoose = require('mongoose');

const AccessoriesSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Everything (Complete Box)', 'Box Only', 'iPhone Only', 'Phone Only', 'MacBook Only', 'iPad Only', 'Watch Only'] },
  deductionPercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model('AccessoriesOption', AccessoriesSchema);
