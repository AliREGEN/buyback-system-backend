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
  header: { type: String, required: true},
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

const AccessoriesSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Everything (Complete Box)', 'Box Only', 'MacBook Only'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const ProcessorSchema = new mongoose.Schema({
  type: { type: String, required: true }, // E.g., 'Apple M1', 'Intel Core i5'
  cpuCores: { type: String }, // For Apple processors: E.g., '8-core CPU'
  gpuCores: { type: String }, // For Apple processors: E.g., '7-core GPU'
  speed: { type: String }, // For Intel processors: E.g., '1.1GHz'
  deductionPercentage: { type: Number, default: 0 }, // Deduction percentage, if applicable
});

const MacBookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    vendor: { type: String, required: true, default: 'Apple' },
    deviceType: { type: String, required: true, default: 'Laptop' },
    modelName: { type: String, required: true, unique: true },
    maxPrice: { type: Number, required: true },
    paymentOptions: { type: [PaymentOptionsSchema], default: undefined },
    colors: [
        {
            color: { type: String, required: true },
            image: { type: String, required: true }, // Image can be updated later
        },
    ],
    memorySizes: [
        {
            size: { type: String },
            deductionPercentage: { type: Number, default: 0 },
        },
    ],
    storageSizes: [
        {
            size: { type: String },
            deductionPercentage: { type: Number, default: 0 },
        },
    ],
    processorTypes: { type: [ProcessorSchema], default: undefined },
    batteryHealth: { type: [BatteryHealthSchema], default: undefined },
    cosmeticIssues: { type: [CosmeticIssuesSchema], default: undefined },
    faults: { type: [FaultsSchema], default: undefined },
    repairs: { type: [RepairSchema], default: undefined },
    frontScreen: { type: [FrontScreenSchema], default: undefined },
    body: { type: [BodySchema], default: undefined },
    accessories: { type: [AccessoriesSchema], default: undefined },
});

module.exports = mongoose.model('MacBook', MacBookSchema);