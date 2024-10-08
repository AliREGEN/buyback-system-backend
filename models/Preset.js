const mongoose = require('mongoose');


// Main preset schema
const PresetSchema = new mongoose.Schema({
  modelName: { type: String, required: true, unique: true },  // The name of the preset (e.g., iPhone X)
  vendor: { type: String, required: true },  // Vendor (Apple, Samsung, etc.)s
  deviceType: { type: String, required: true },  // Device type

  // Categories of options stored as arrays of dynamic deductions
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
      processorTypes: [
        {
          option: { type: mongoose.Schema.Types.ObjectId, ref: 'ProcessorOption', _id: false },
          deductionPercentage: { type: Number, default: 0 },
        }
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
    strap: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'StrapOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
    ],
    band: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'BandOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
    ],
    body: [
    {
      option: { type: mongoose.Schema.Types.ObjectId, ref: 'BodyOption', _id: false },
      deductionPercentage: { type: Number, default: 0 },
    },
    ],
});

module.exports = mongoose.model('Preset', PresetSchema);