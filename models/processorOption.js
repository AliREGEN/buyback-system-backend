const mongoose = require('mongoose');

const ProcessorSchema = new mongoose.Schema({
  type: { type: String, required: true }, // E.g., 'Apple M1', 'Intel Core i5'
  cpuCores: { type: String }, // For Apple processors: E.g., '8-core CPU'
  gpuCores: { type: String }, // For Apple processors: E.g., '7-core GPU'
  speed: { type: String }, // For Intel processors: E.g., '1.1GHz'
  deductionPercentage: { type: Number, default: 0 }, // Deduction percentage, if applicable
});

module.exports = mongoose.model('ProcessorOption', ProcessorSchema);