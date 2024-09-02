const admin = require('firebase-admin');
const serviceAccount = require('./FirebaseServiceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "r-e-g-e-n-admin-nk6psf.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };