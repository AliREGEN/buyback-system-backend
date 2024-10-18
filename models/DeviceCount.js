const mongoose = require('mongoose');

const DeviceCountSchema = new mongoose.Schema({
    count: {
        type: Number,
        required: true,
        default: 4542,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('DeviceCount', DeviceCountSchema);