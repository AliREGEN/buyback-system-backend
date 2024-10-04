const mongoose = require('mongoose');

const ApplePencilSchema = new mongoose.Schema({
  generation: { type: String, required: true },
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model('ApplePencilOption', ApplePencilSchema);