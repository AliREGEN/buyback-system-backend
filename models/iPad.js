const mongoose = require('mongoose');

// Define sub-schemas for categories that remain the same
const PaymentOptionsSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Store Credit', 'Instant Cash'] },
  deductionPercentage: { type: Number, default: 0 },
});


// Main iPad schema
const iPadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vendor: { type: String, required: true, default: 'Apple' },
  deviceType: { type: String, required: true, default: 'Tablet' },
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
      size: { type: String },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  activatedSince: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivatedSinceOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
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
  body: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'BodyOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  connectivity: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'ConnectivityOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  applePencil: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplePencilOption', _id: false },
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

module.exports = mongoose.model('iPad', iPadSchema);
