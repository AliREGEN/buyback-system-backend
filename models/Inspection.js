const mongoose = require('mongoose');

const PtaOptionSchema = new mongoose.Schema({
  value: { type: String, required: true },
  deductionPercentage: { type: Number, required: true },
});

const RepairOptionSchema = new mongoose.Schema({
  repair: { type: String, required: true }, 
});

const CosmeticIssueSchema = new mongoose.Schema({
  header: { type: String, required: true },
  value: { type: String, required: true },
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

const InspectionSchema = new mongoose.Schema({
  modelName: { type: String, required: true },
  maxPrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  storageSize: { type: String, required: true },
  colorOption: { type: String, required: true },
  simOption: { type: String },
  batteryHealth: { type: String },
  isFunctional: { type: String },
  faults: { type: [FaultOptionSchema] }, 
  isRepaired: { type: String },
  repair: { type: [RepairOptionSchema] }, 
  isDamaged: { type: String },
  cosmeticIssues: { type: [CosmeticIssueSchema] }, 
  frontScreen: { type: String },
  back: { type: String },
  side: { type: String },
  pta: { type: Map, of: PtaOptionSchema }, 
  accessories: { type: String },
  // Customer details
  fullName: { type: String, required: true },
  whatsapp: { type: String, required: true },
  isInLahore: { type: Boolean, required: true },
  buyingPreference: { type: String, required: true },
  // IP and Location details
  ipAddress: { type: String },
  location: { type: LocationSchema },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Inspection', InspectionSchema);
