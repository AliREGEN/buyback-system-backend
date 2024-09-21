const mongoose = require('mongoose');

// Define sub-schemas for each category
const BatteryHealthSchema = new mongoose.Schema({
    health: { type: String, required: true },
    deductionPercentage: { type: Number, default: 0 },
});

const CosmeticIssuesSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const FaultsSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const RepairSchema = new mongoose.Schema({
  repair: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const AccessoriesSchema = new mongoose.Schema({
  option: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const SIMVariantSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Dual eSIM', 'Dual Physical SIM', 'eSIM + Physical SIM'] },
  deductionPercentage: { type: Number, default: 0 },
});

const PTASchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Is Your iPhone PTA Approved?', 'Is Your iPhone Factory Unlocked?'] },
  deductionPercentage: { type: Number, default: 0 },
});


const FrontScreenSchema = new mongoose.Schema({
  header: { type: String, required: true},
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const BackSchema = new mongoose.Schema({
  header: { type: String, required: true},
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const SideSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
});

const iPhonePresetSchema = new mongoose.Schema({
    modelName: { type: String, required: true, unique: true },
  vendor: { type: String, required: true, default: 'Apple' },
  deviceType: { type: String, required: true, default: 'Smartphone' },
  batteryHealth: { type: [BatteryHealthSchema], default: undefined },
  cosmeticIssues: { type: [CosmeticIssuesSchema], default: undefined },
  faults: { type: [FaultsSchema], default: undefined },
  repairs: { type: [RepairSchema], default: undefined },
  frontScreen: { type: [FrontScreenSchema], default: undefined },
  back: { type: [BackSchema], default: undefined },
  side: { type: [SideSchema], default: undefined },
  simVariant: { type: [SIMVariantSchema], default: undefined },
  pta: { type: [PTASchema], default: undefined },
  accessories: { type: [AccessoriesSchema], default: undefined },
});

module.exports = mongoose.model('iPhonePreset', iPhonePresetSchema);    