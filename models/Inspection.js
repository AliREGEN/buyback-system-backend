const mongoose = require('mongoose');

const PtaOptionSchema = new mongoose.Schema({
  value: { type: String, required: true },
  deductionPercentage: { type: Number, required: true },
});

const RepairOptionSchema = new mongoose.Schema({
  repair: { type: String, required: true }, // Only repair and deductionPercentage are needed
});

const CosmeticIssueSchema = new mongoose.Schema({
  header: { type: String, required: true }, // Header to differentiate cosmetic issues
  value: { type: String, required: true },
});

const FaultOptionSchema = new mongoose.Schema({
  header: { type: String, required: true }, // Header to differentiate fault options
  value: { type: String, required: true },
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
  faults: { type: [FaultOptionSchema] }, // Array of fault options
  isRepaired: { type: String },
  repair: { type: [RepairOptionSchema] }, // Array of repair options
  isDamaged: { type: String },
  cosmeticIssues: { type: [CosmeticIssueSchema] }, // Array of cosmetic issues
  frontScreen: { type: String },
  back: { type: String },
  side: { type: String },
  pta: { type: Map, of: PtaOptionSchema }, // Map for PTA options
  accessories: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Inspection', InspectionSchema);
