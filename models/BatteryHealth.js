const mongoose = require('mongoose');

const BatteryHealthSchema = new mongoose.Schema({
    batteryHealth: {
        type: String,
        required: true,
        enum: ['95% or Above', '90% or Above' ,'85% or Above', '80% or Above', 'Less than 80%'],
    },
    deductionPercentage: {
        type: Number,
        default: 0,
    },
    image : {
        type: String
    },
});

module.exports = mongoose.model('BatteryHealth', BatteryHealthSchema);
