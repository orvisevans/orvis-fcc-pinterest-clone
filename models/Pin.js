const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  source: String,
  title: String,
  owner: String,
}, { timestamps: true });

const Pin = mongoose.model('Pin', pinSchema);

module.exports = Pin;
