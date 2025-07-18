const mongoose = require('mongoose');

let userSchema=new mongoose.Schema({
  regNo: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-z]+\.[a-z0-9]+@vitapstudent\.ac\.in$/i,
      "Invalid email format. Expected: name.rollnumber@vitapstudent.ac.in" 
    ]
  },
  crushes: {
    type: Array,
    default: []
  },
  MatchedWith: {
    type :Array,
    default: []
  }
});

module.exports=mongoose.model('user',userSchema);