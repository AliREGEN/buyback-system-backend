const mongoose = require('mongoose');

const DeviceCountSchema = new mongoose.Schema({
    count: {
        type: Number,
        required: true,
        default: 4715,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('DeviceCount', DeviceCountSchema);