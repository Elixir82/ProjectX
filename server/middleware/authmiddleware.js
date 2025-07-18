const jwt = require('jsonwebtoken');
const userModel = require('../models/User.Model.js');
let authMiddleware=async (req,res,next)=>{
  let token=req.headers.authorization?.split(' ')[1];

   try {

    if (!token) return res.status(404).send("Unauthorized");

    let isVerifyed = jwt.verify(token, process.env.SECRET_KEY);

    let user = await userModel.findOne({email: isVerifyed.email});

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ 
      error: error.name === 'JsonWebTokenError' 
        ? "Invalid token" 
        : "Token expired" 
    });
  }
}

module.exports = authMiddleware;