const mongoose = require('mongoose');

const FrontScreenSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
    enum: ['Excellent', 'Good', 'Fair', 'Acceptable'],
  },
  condition: {
    type: String,
    required: true,
    enum: [
      'Very light signs of usage or 1 - 2 minor scratches',
      'Some signs of usage or a few minor scratches',
      'Moderate signs of usage or visible scratches',
      'Heavy signs of usage or deep scratches',
    ],
  },
  deductionPercentage: {
    type: Number,
    default: 0,
  },
  image : {
    type: String
  },
});

module.exports = mongoose.model('FrontScreen', FrontScreenSchema);
