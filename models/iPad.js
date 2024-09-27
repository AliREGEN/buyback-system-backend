const mongoose = require('mongoose');

// Define sub-schemas for categories that remain the same
const BatteryHealthSchema = new mongoose.Schema({
  health: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const CosmeticIssuesSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const PaymentOptionsSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Store Credit', 'Instant Cash'] },
  deductionPercentage: { type: Number, default: 0 },
});

const FaultsSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const RepairSchema = new mongoose.Schema({
  repair: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const FrontScreenSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const BodySchema = new mongoose.Schema({
  header: { type: String, required: true},
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const ConnectivitySchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['WiFi + Cellular', 'WiFi Only'] },
  deductionPercentage: { type: Number, default: 0 },
});

const ApplePencilSchema = new mongoose.Schema({
  generation: { type: String, required: true },
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const AccessoriesSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Everything (Complete Box)', 'Box Only', 'iPad Only'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const PTASchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Is Your iPad PTA Approved?', 'Is Your iPad Factory Unlocked?'] },
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
  batteryHealth: { type: [BatteryHealthSchema], default: undefined },
  cosmeticIssues: { type: [CosmeticIssuesSchema], default: undefined },
  faults: { type: [FaultsSchema], default: undefined },
  repairs: { type: [RepairSchema], default: undefined },
  frontScreen: { type: [FrontScreenSchema], default: undefined },
  body: { type: [BodySchema], default: undefined },
  connectivity: { type: [ConnectivitySchema], default: undefined },
  applePencil: { type: [ApplePencilSchema], default: undefined },
  pta: { type: [PTASchema], default: undefined },
  accessories: { type: [AccessoriesSchema], default: undefined },
});

module.exports = mongoose.model('iPad', iPadSchema);
