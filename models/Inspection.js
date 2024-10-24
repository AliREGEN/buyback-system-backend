const mongoose = require('mongoose');

// Reused Schemas
const PtaOptionSchema = new mongoose.Schema({
  value: { type: String },
});

const UnknownPartSchema = new mongoose.Schema({
  value: { type: String },
});

const RepairOptionSchema = new mongoose.Schema({
  repair: { type: String, required: true },
  // Removed unknownPart from here
});

const CosmeticIssueSchema = new mongoose.Schema({
  header: { type: String, required: true },
  value: { type: String, required: true },
});

const CosmeticConditionSchema = new mongoose.Schema({
  header: { type: String, required: true },
  value: { type: String, required: true },
});

const PaymentOptionSchema = new mongoose.Schema({
  option: { type: String, required: true },
  deductionPercentage: { type: Number, required: true },
});

const FaultOptionSchema = new mongoose.Schema({
  header: { type: String, required: true },
  value: { type: String, required: true },
});

const LocationSchema = new mongoose.Schema({
  city: { type: String },
  region: { type: String },
  country: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
});

const ProcessorOptionSchema = new mongoose.Schema({
  type: { type: String },
  cpuCores: { type: String },
  gpuCores: { type: String },
  speed: { type: String },
});

const ApplePencilSchema = new mongoose.Schema({
  generation: { type: String },
  condition: { type: String },
});

// Main Inspection Schema
const InspectionSchema = new mongoose.Schema({
  inspectionId: { type: String, required: true, unique: true },
  modelName: { type: String, required: true },
  maxPrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  deductionDetails: [
    {
      option: { type: String },
      deductionAmount: { type: Number },
      deductionPercentage: { type: Number },
    },
  ],
  adjustedPrice: { type: Number },
  deviceType: { type: String, required: true },
  watchCaseType: { type: String }, // For watches
  watchCaseFinish: { type: String }, // For watches
  watchCaseSize: { type: String }, // For watches
  band: { type: String }, // For watches
  strap: { type: CosmeticConditionSchema }, // New field for strap condition
  storageSize: { type: String },
  colorOption: { type: String },
  memorySize: { type: String },
  processorType: { type: ProcessorOptionSchema, default: undefined },
  simOption: { type: String },
  connectivity: { type: String },
  batteryHealth: { type: String },
  activatedSince: { type: String },
  isFaulty: { type: String },
  faults: { type: [FaultOptionSchema] },
  isRepaired: { type: String },
  repair: { type: [RepairOptionSchema] },
  isDamaged: { type: String },
  cosmeticIssues: { type: [CosmeticIssueSchema] },
  frontScreen: { type: CosmeticConditionSchema },
  back: { type: CosmeticConditionSchema },
  side: { type: CosmeticConditionSchema },
  body: { type: CosmeticConditionSchema },
  pta: { type: [PtaOptionSchema], default: undefined },
  unknownPart: { type: [UnknownPartSchema], default: undefined },
  accessories: { type: String },
  applePencil: { type: [ApplePencilSchema], default: undefined },
  paymentOption: { type: PaymentOptionSchema, required: true },
  // Customer details
  fullName: { type: String, required: true },
  whatsapp: { type: String, required: true },
  isInLahore: { type: Boolean, required: true },
  buyingPreference: { type: String, required: true },
  acceptedTerms: { type: Boolean, required: true },
  acceptedInspection: { type: Boolean },
  // IP and Location details
  ipAddress: { type: String },
  location: { type: LocationSchema },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Inspection', InspectionSchema);
