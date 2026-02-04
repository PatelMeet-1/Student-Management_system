const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  maxMarks: {
    internal: { type: Number, default: 30 },
    practical: { type: Number, default: 25 },
    university: { type: Number, default: 70 },
    final: { type: Number, default: 100 }
  },
  passingRatio: { type: Number, default: 0.33 }, // 33% default
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'config' });

module.exports = mongoose.model('Config', configSchema);
