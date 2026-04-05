const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);