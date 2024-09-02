const mongoose = require('mongoose');

const AccessoriesSchema = new mongoose.Schema({
  option: {
    type: String,
    required: true,
    enum: ['Everything (Complete Box)', 'Box Only', 'iPhone Only'],
  },
  deductionPercentage: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model('Accessories', AccessoriesSchema);
