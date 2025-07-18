const mongoose = require('mongoose');
require('dotenv').config();
let connectDB = async () => {
  try {
    let DBresp=await mongoose.connect(process.env.Mongo_URL);
    if(DBresp){
      console.log("Database is connected");
    }else{
      console.log("Database couldn't connect");
    }
  } catch (error) {
    console.error("Error while connecting DB: ",error);
  }
}

module.exports=connectDB;