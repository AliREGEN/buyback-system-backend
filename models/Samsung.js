const mongoose = require('mongoose');

const PaymentOptionsSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Store Credit', 'Instant Cash'] },
  deductionPercentage: { type: Number, default: 0 },
});


const SamsungSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    vendor: { type: String, required: true, default: 'Samsung' },
    deviceType: { type: String, required: true, default: 'Smartphone' },
    modelName: { type: String, required: true, unique: true },
    maxPrice: { type: Number, required: true },

    paymentOptions: { type: [PaymentOptionsSchema], default: undefined },

    colors: [
        {
            color: { type: String, required: true },
            image: { type: String, required: true },
        },
    ],
    storageSizes: [
        {
            size: { type: String, required: true },
            deductionPercentage: { type: Number, required: true },
        },
    ],
      cosmeticIssues: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'CosmeticIssueOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  faults: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'FaultOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  repairs: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  frontScreen: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'FrontScreenOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  back: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'BackOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  side: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'SideOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  simVariant: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'SIMVariantOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  pta: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'PTAOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  accessories: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'AccessoriesOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model('Samsung', SamsungSchema);