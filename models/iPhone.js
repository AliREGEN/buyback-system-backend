const mongoose = require('mongoose');

// Define sub-schemas for each category

const BatteryHealthSchema = new mongoose.Schema({
  health: { type: String, required: true, enum: ['95% or Above', '90% or Above', '85% or Above', '80% or Above', 'Less than 80%'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const CosmeticIssuesSchema = new mongoose.Schema({
  header: { type: String, required: true, enum: ['Damaged Display', 'Damaged Back', 'Damaged Camera Lens', 'Damaged Frame'] },
  condition: { type: String, required: true, enum: ['Display glass is cracked or shattered', 'Back glass is cracked or shattered', 'Camera lens is cracked or shattered', 'Body is broken, bent or heavily dented'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const FaultsSchema = new mongoose.Schema({
  header: { type: String, required: true, enum: ['Faulty Display', 'Faulty Earpiece', 'Faulty Loudspeaker', 'Faulty Face ID', 'Faulty Proximity Sensor', 'Faulty Vibration Motor', 'Faulty Power Button', 'Faulty Volume Button', 'Faulty Mute Button', 'Faulty Front Camera', 'Faulty Rear Camera', 'Faulty Flash', 'Faulty Microphone', 'Faulty Charging Port'] },
  condition: { type: String, required: true, enum: ['Spots/Dead pixels or visible lines on the display', 'Earpiece is not working or the audio is noisy', 'Loudspeaker is not working or the audio is noisy', 'Face ID is not working or not working consistently', 'Proximity sensor is not working - The display does not turn off during the phone call', 'Vibration motor is not working or there is a rattling noise', 'Power button is not working or not working consistently', 'Volume button is not working or not working consistently', 'Mute button is not working or not working consistently', 'Front camera is not working or the image is blurry', 'Rear camera is not working or the image is blurry', 'Flash is not working', 'Microphone is not working or the audio is noisy', 'Charging port is faulty or the phone is not charging'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const RepairSchema = new mongoose.Schema({
  repair: { type: String, required: true, enum: ['Touch screen was replaced', 'Display was replaced', 'Front Camera was replaced', 'Back Camera was replaced', 'Speaker/Earpiece was replaced', 'Battery was replaced', 'Battery was replaced by REGEN', 'Motherboard/Logic board was repaired', 'Something else was repaired'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const FrontScreenSchema = new mongoose.Schema({
  header: { type: String, required: true, enum: ['Excellent', 'Good', 'Fair', 'Acceptable'] },
  condition: { type: String, required: true, enum: ['Very light signs of usage or 1 - 2 minor scratches', 'Some signs of usage or a few minor scratches', 'Moderate signs of usage or visible scratches', 'Heavy signs of usage or deep scratches'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const BackSchema = new mongoose.Schema({
  header: { type: String, required: true, enum: ['Excellent', 'Good', 'Fair', 'Acceptable'] },
  condition: { type: String, required: true, enum: ['Very light signs of usage or 1 - 2 minor scratches', 'Some signs of usage or a few minor scratches', 'Moderate signs of usage or visible scratches', 'Heavy signs of usage or deep scratches'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const SideSchema = new mongoose.Schema({
  header: { type: String, required: true, enum: ['Excellent', 'Good', 'Fair', 'Acceptable'] },
  condition: { type: String, required: true, enum: ['Very light signs of usage or 1 - 2 minor scratches', 'Some signs of usage or a few minor scratches', 'Moderate signs of usage or visible scratches', 'Heavy signs of usage or deep scratches'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

const SIMVariantSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Dual eSIM', 'Dual Physical SIM', 'eSIM + Physical SIM'] },
  deductionPercentage: { type: Number, default: 0 },
});

const PTASchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Is your iPhone PTA Approved?', 'Is your iPhone Factory Unlocked?'] },
  deductionPercentage: { type: Number, default: 0 },
});

const AccessoriesSchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['Everything (Complete Box)', 'Box Only', 'iPhone Only'] },
  deductionPercentage: { type: Number, default: 0 },
  image: { type: String, default: '' }, // Image can be updated later
});

// Main iPhone schema

const iPhoneSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  modelName: { type: String, required: true, unique: true },
  maxPrice: { type: Number, required: true },
  colors: [
    {
      color: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
  storageSizes: [
    {
      size: { type: String },
      deductionPercentage: { type: Number, default: 0 },
    },
  ],
  batteryHealth: { type: [BatteryHealthSchema], default: undefined },
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

module.exports = mongoose.model('iPhone', iPhoneSchema);
