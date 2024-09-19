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

const BandsTypeSchema = new mongoose.Schema({
    option: { type: String, required: true, enum: ['Sport Band', 'Sport Loop', 'Leather Loop', 'Leather Link', 'Milanese Loop', 'Link Bracelet', 'Modern Buckle', 'Classic Buckle', 'Hermes', 'Nike', 'Aftermarket Band'] },
    deductionPercentage: { type: Number, default: 0 },
    image: { type: String, default: '' }, // Image can be updated later
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

const BodySchema = new mongoose.Schema({
  header: { type: String, required: true},
  condition: { type: String, required: true },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const StrapSchema = new mongoose.Schema({
    header: { type: String, required: true },
    condition: { type: String, required: true },
    deductionPercentage: { type: Number, default: 0 },
    image: { type: String, default: '' }, // Image can be updated later
});

const AccessoriesSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Everything (Complete Box)', 'Box Only', 'Watch Only'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const WatchSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    vendor: { type: String, required: true, default: 'Apple' },
    deviceType: { type: String, required: true, default: 'Smart Watch' },
    modelName: { type: String, required: true, unique: true },
    maxPrice : { type: Number, required: true },
    paymentOptions: { type: [PaymentOptionsSchema], default: undefined },
    watchCaseType: [
        {
            caseType: { type: String },
            deductionPercentage: { type: Number, default: 0 },
        },
    ],
    watchCaseFinish: [
        {
            finish: { type: String, required: true },
            image: { type: String, required: true },
        },
    ],
    watchCaseSize: [
        {
            size: { type: String },
            deductionPercentage: { type: Number, default: 0 },
        },
    ],
    strapCondition: { type: [StrapSchema], default: undefined },
    cosmeticIssues: { type: [CosmeticIssuesSchema], default: undefined },
    batteryHealth: { type: [BatteryHealthSchema], default: undefined },
    bandsType: { type: [BandsTypeSchema], default: undefined },
    faults: { type: [FaultsSchema], default: undefined },
    repairs: { type: [RepairSchema], default: undefined },
    bodyCondition: { type: [BodySchema], default: undefined },
    accessories: { type: [AccessoriesSchema], default: undefined },
});

module.exports = mongoose.model('Watch', WatchSchema);