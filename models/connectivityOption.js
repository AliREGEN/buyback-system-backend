const mongoose = require('mongoose');

const ConnectivitySchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['WiFi + Cellular', 'WiFi Only'] },
  deductionPercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model('ConnectivityOption', ConnectivitySchema);