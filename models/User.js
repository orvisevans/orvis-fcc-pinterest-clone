const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  twitter: {type: String, unique: true },
  tokens: Array,
  
  profile: {
    name: String,
    screenName: String,
    picture: String
  },

  pins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pin'}]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
