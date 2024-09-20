const mongoose = require('mongoose');

// Define sub-schemas for each category

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

const BackSchema = new mongoose.Schema({
  header: { type: String, required: true},
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const SideSchema = new mongoose.Schema({
  header: { type: String, required: true },
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const SIMVariantSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Dual Physical SIM', 'eSIM + Physical SIM'] },
  deductionPercentage: { type: Number, default: 0 },
});

const PTASchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Is Your Phone Official PTA Approved?', 'Is Your Phone CPID Approved?', 'Is Your Phone Patched?'] },
  deductionPercentage: { type: Number, default: 0 },
});

const AccessoriesSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Everything (Complete Box)', 'Box Only', 'Phone Only'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
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

module.exports = mongoose.model('Samsung', SamsungSchema);