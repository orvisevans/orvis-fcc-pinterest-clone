const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  source: String,
  title: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, { timestamps: true });

const Pin = mongoose.model('Pin', pinSchema);

module.exports = Pin;
