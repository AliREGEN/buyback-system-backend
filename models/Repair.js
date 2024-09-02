const mongoose = require('mongoose');

const RepairSchema = new mongoose.Schema({
    Repair: {
        type: String,
        required: true,
        enum: [
            'Touch screen was replaced',
            'Display was replaced',
            'Front Camera was replaced',
            'Back Camera was replaced',
            'Speaker/Earpiece was replaced',
            'Battery was replaced',
            'Battery was replaced by REGEN',
            'Motherboard/Logic board was repaired',
            'Something else was repaired',
        ],
    },
    deductionPercentage: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model('Repair', RepairSchema);
