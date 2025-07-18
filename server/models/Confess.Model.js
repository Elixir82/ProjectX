const mongoose = require('mongoose');

const confessSchema = new mongoose.Schema({
  confession: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Confession', confessSchema);
