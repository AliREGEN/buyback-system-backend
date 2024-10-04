const mongoose = require('mongoose');

const RepairSchema = new mongoose.Schema({
  option: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model('RepairOption', RepairSchema);
