const mongoose = require('mongoose');

const ConnectivitySchema = new mongoose.Schema({
  option: { type: String, required: true, enum: ['WiFi + Cellular', 'WiFi Only', 'GPS + Cellular', 'GPS Only'] },
  deductionPercentage: { type: Number, default: 0 },
      deviceType: {
    type: String,
    enum: ['Smartphone', 'Tablet', 'Laptop', 'Smart Watch'], // Ensure valid device types
    required: true,
  },
});

module.exports = mongoose.model('ConnectivityOption', ConnectivitySchema);