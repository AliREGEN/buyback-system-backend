const mongoose = require('mongoose');

const CosmeticIssuesSchema = new mongoose.Schema({
    header:{
        type: String,
        required: true,
        enum : ['Damaged Display', 'Damaged Back', 'Damaged Camera Lens', 'Damaged Frame',],
    },
    condition: {
        type: String,
        required: true,
        enum: ['Display glass is cracked or shattered',
            'Back glass is cracked or shattered',
            'Camera lens is cracked or shattered',
            'Body is broken, bent or heavily dented'
        ],
    },
    deductionPercentage: {
        type: Number,
        default: 0,
    },
    image : {
        type: String
    },
});

module.exports = mongoose.model('CosmeticIssues', CosmeticIssuesSchema);
