const mongoose = require('mongoose');
const FrontScreen = require('./models/FrontScreen');
const Back = require('./models/Back');
const Side = require('./models/Side');
const PTA = require('./models/PTA');
const Accessories = require('./models/Accessories');
const Repair = require('./models/Repair');
const BatteryHealth = require('./models/BatteryHealth');
const Faults = require('./models/Faults');
const SIMVariant = require('./models/SIMVariant');
const CosmeticIssues = require('./models/CosmeticIssues');

mongoose.connect('mongodb://localhost:27017/REGENBBAdmin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const baseUrl = 'https://storage.googleapis.com/r-e-g-e-n-admin-nk6psf.appspot.com/static/';

// const seedFrontScreen = async () => {
//   const frontScreens = [
//     { header: 'Excellent', condition: 'Very light signs of usage or 1 - 2 minor scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Good', condition: 'Some signs of usage or a few minor scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Fair', condition: 'Moderate signs of usage or visible scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Acceptable', condition: 'Heavy signs of usage or deep scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//   ];

//   await FrontScreen.insertMany(frontScreens);
//   console.log('Front Screen options seeded!');
// };

// const seedBack = async () => {
//   const backs = [
//     { header: 'Excellent', condition: 'Very light signs of usage or 1 - 2 minor scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Good', condition: 'Some signs of usage or a few minor scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Fair', condition: 'Moderate signs of usage or visible scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Acceptable', condition: 'Heavy signs of usage or deep scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//   ];

//   await Back.insertMany(backs);
//   console.log('Back options seeded!');
// };

// const seedSide = async () => {
//   const sides = [
//     { header: 'Excellent', condition: 'Very light signs of usage or 1 - 2 minor scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Good', condition: 'Some signs of usage or a few minor scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Fair', condition: 'Moderate signs of usage or visible scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { header: 'Acceptable', condition: 'Heavy signs of usage or deep scratches', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//   ];

//   await Side.insertMany(sides);
//   console.log('Side options seeded!');
// };

// const seedBentOrLoosen = async () => {
//   const bentOrLoosen = [
//     { condition: 'Loosen screen/Gap in screen and body', deductionPercentage: 0, image: `${baseUrl}PowerButton.webp` },
//     { condition: 'Not bent or loosen', deductionPercentage: 0, image: `${baseUrl}SpeakerFaulty.webp` },
//   ];

//   await BentOrLoosen.insertMany(bentOrLoosen);
//   console.log('Bent or Loosen options seeded!');
// };

// const seedPTA = async () => {
//   const ptaOptions = [
//     { option: 'Is your iPhone PTA Approved?', deductionPercentage: 30 },
//     { option: 'Is your iPhone Factory Unlocked?', deductionPercentage: 15 },
    
//   ];

//   await PTA.insertMany(ptaOptions);
//   console.log('PTA options seeded!');
// };

// const seedSIMVariant = async () => {
//   const simOptions = [
//     { option: 'Dual eSIM', deductionPercentage: 15 },
//     { option: 'Dual Physical SIM', deductionPercentage: 15 },
//     { option: 'eSIM + Physical SIM', deductionPercentage: 15 },
    
//   ];

//   await SIMVariant.insertMany(simOptions);
//   console.log('SIM options seeded!');
// };
// const seedAccessories = async () => {
//   const accessoriesOptions = [
//     { option: 'Everything (Complete Box)', deductionPercentage: 0, image: `${baseUrl}OriginalCharger.webp` },
//     { option: 'Box Only', deductionPercentage: 0, image: `${baseUrl}BoxWithSameIMEI.webp` },
//     { option: 'iPhone Only', deductionPercentage: 0, image: `${baseUrl}VibratorNotWorking.webp` },
//   ];

//   await Accessories.insertMany(accessoriesOptions);
//   console.log('Accessories options seeded!');
// };

// const seedRepair = async () => {
//   const RepairOptions = [
//     { Repair: 'Touch screen was replaced', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { Repair: 'Display was replaced', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { Repair: 'Front Camera was replaced', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { Repair: 'Back Camera was replaced', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { Repair: 'Speaker/Earpiece was replaced', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { Repair: 'Battery was replaced', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { Repair: 'Battery was replaced by REGEN', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { Repair: 'Motherboard/Logic board was repaired', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//     { Repair: 'Something else was repaired', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FFaceIDNotWorking.webp?alt=media&token=944eef2f-5d83-4505-9815-1cac6fb9d362` },
//   ];

//   await Repair.insertMany(RepairOptions);
//   console.log('Repair options seeded!');
// };

// const seedBatteryHealth = async () => {
//   const batteryHealthOptions = [
//     { batteryHealth: '95% or Above', deductionPercentage: 0, image: `https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/enr0s8dymmgxrmyuimtm` },
//     { batteryHealth: '90% or Above', deductionPercentage: 0, image: `https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/relbz7xhqduexymehe9y` },
//     { batteryHealth: '85% or Above', deductionPercentage: 0, image: `https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/uvh5yxtbthwvzaheked3` },
//     { batteryHealth: '80% or Above', deductionPercentage: 0, image: `https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/bmsq5gzmbagmkwouiprq` },
//     { batteryHealth: 'Less than 80%', deductionPercentage: 0, image: `https://res.cloudinary.com/dl1kjmaoq/image/upload/f_auto,q_auto/v1/static/uxgq8sqrcfrx6jytzglv` },
//   ];

//   await BatteryHealth.insertMany(batteryHealthOptions);
//   console.log('Battery Health options seeded!');
// };

const seedFaults = async () => {
  const faultOptions = [
    { header: 'Faulty Loudspeaker', condition: 'Loudspeaker is not working or the audio is noisy', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FProximitySensorNotWorking.webp?alt=media&token=550472d9-166a-4608-8247-74bfc433e2bc` },
  ];

  await Faults.insertMany(faultOptions);
  console.log('Fault options seeded!');
};

// const seedCosmeticIssues = async () => {
//   const cosmeticIssuesOptions = [
//     { header: 'Damaged Display', condition: 'Display glass is cracked or shattered', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FProximitySensorNotWorking.webp?alt=media&token=550472d9-166a-4608-8247-74bfc433e2bc` },
//     { header: 'Damaged Back', condition: 'Back glass is cracked or shattered', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FProximitySensorNotWorking.webp?alt=media&token=550472d9-166a-4608-8247-74bfc433e2bc` },
//     { header: 'Damaged Camera Lens', condition: 'Camera lens is cracked or shattered', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FProximitySensorNotWorking.webp?alt=media&token=550472d9-166a-4608-8247-74bfc433e2bc` },
//     { header: 'Damaged Body', condition: 'Body is broken, bent or heavily dented', deductionPercentage: 0, image: `https://firebasestorage.googleapis.com/v0/b/r-e-g-e-n-admin-nk6psf.appspot.com/o/static%2FProximitySensorNotWorking.webp?alt=media&token=550472d9-166a-4608-8247-74bfc433e2bc` },
//   ];

//   await CosmeticIssues.insertMany(cosmeticIssuesOptions);
//   console.log('Cosmetic Issues options seeded!');
// };

const seedDatabase = async () => {
  // await seedFrontScreen();
  // await seedBack();
  // await seedSide();
  // await seedBentOrLoosen();
  // await seedSIMVariant();
  // await seedAccessories();
  // await seedRepair();
  // await seedBatteryHealth();
  await seedFaults();
  // await seedCosmeticIssues();
  mongoose.connection.close();
};

seedDatabase();
