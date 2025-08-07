const mongoose =require('mongoose');

let crushSchema=new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  crushRegno: {
    type: String,
    required: true,
    unique: true
  },
  crushName: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('crush',crushSchema);