const mongoose = require('mongoose');

const FaultsSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model('FaultOption', FaultsSchema);
