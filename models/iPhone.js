const mongoose = require('mongoose');

// Payment Options Schema
const PaymentOptionsSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Store Credit', 'Instant Cash'] },
  deductionPercentage: { type: Number, default: 0 },
});

// Main iPhone schema
const iPhoneSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vendor: { type: String, required: true, default: 'Apple' },
  deviceType: { type: String, required: true, default: 'Smartphone' },
  modelName: { type: String, required: true, unique: true },
  maxPrice: { type: Number, required: true },

  // Payment options with deduction percentages
  paymentOptions: { type: [PaymentOptionsSchema], default: undefined },

  // Color options
  colors: [
    {
      color: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],

  // Storage sizes with their respective deduction percentages
  storageSizes: [
    {
      size: { type: String, required: true },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],

  // Referenced deduction options with custom deduction percentage for each device
  batteryHealth: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'BatteryHealthOption', _id: false },
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
  unknownParts: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'UnknownPartOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model('iPhone', iPhoneSchema);
