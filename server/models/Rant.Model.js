const mongoose = require('mongoose');

const rantSchema = new mongoose.Schema({
  rant: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rant', rantSchema);
