const mongoose = require('mongoose');

const BatteryHealthSchema = new mongoose.Schema({
    option: { type: String, required: true},
    deductionPercentage: { type: Number, default: 0},
})

module.exports = mongoose.model('BatteryHealthOption', BatteryHealthSchema);