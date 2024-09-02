const mongoose = require('mongoose');

const FaultsSchema = new mongoose.Schema({
    header:{
        type: String,
        required: true,
        enum : ['Faulty Display', 'Faulty Earpiece', 'Faulty Loudspeaker', 'Faulty Face ID', 'Faulty Proximity Sensor' ,'Faulty Vibration Motor', 'Faulty Power Button', 'Faulty Volume Button', 'Faulty Mute Button', 'Faulty Front Camera', 'Faulty Rear Camera', 'Faulty Flash', 'Faulty Microphone', 'Faulty Charging Port'],
    },
    condition: {
        type: String,
        required: true,
        enum: ['Spots/Dead pixels or visible lines on the display',
            'Earpiece is not working or the audio is noisy',
            'Loudspeaker is not working or the audio is noisy',
            'Face ID is not working or not working consistently',
            'Proximity sensor is not working - The display does not turn off during the phone call',
            'Vibration motor is not working or there is a rattling noise',
            'Power button is not working or not working consistently',
            'Volume button is not working or not working consistently',
            'Mute button is not working or not working consistently',
            'Front camera is not working or the image is blurry',
            'Rear camera is not working or the image is blurry',
            'Flash is not working',
            'Microphone is not working or the audio is noisy',
            'Charging port is faulty or the phone is not charging',],
    },
    deductionPercentage: {
        type: Number,
        default: 0,
    },
    image : {
        type: String
    },
});

module.exports = mongoose.model('Faults', FaultsSchema);
