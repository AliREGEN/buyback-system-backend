const mongoose = require('mongoose');

const tradeInSubmissionSchema = new mongoose.Schema({
  tradeInValue: { type: Number, required: true },
  productModel: { type: String, required: true },
  storageSize: { type: String, required: true },
  functional: { type: String, required: true, enum: ['Yes', 'No'] },
  repaired: { type: String, required: true, enum: ['Yes', 'No'] },
  condition: { type: String, required: true, enum: ['Open Box', 'Excellent', 'Good', 'Fair'] },
  ptaApproved: { type: String, required: true, enum: ['Yes', 'No'] },
  factoryUnlocked: { type: String, enum: ['Yes', 'No'], default: null },
  accessories: { type: String, required: true, enum: ['Original Box Included', 'Not Included'] },
  discountCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TradeInSubmission = mongoose.model('TradeInSubmission', tradeInSubmissionSchema);

module.exports = TradeInSubmission;
