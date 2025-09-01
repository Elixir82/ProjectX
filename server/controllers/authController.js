const express = require('express');
const router = express.Router();
const otpModel = require('../models/Otp.Model.js');
const userModel = require('../models/User.Model.js');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let Signup = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const vitapEmailRegex = /^[a-z]+\.[a-z0-9]+@vitapstudent\.ac\.in$/i;
  if (!vitapEmailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid VITAP email format. Expected: name.rollnumber@vitapstudent.ac.in"
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await otpModel.deleteMany({ email });

    await otpModel.create({
      email: email,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RegMatch" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'OTP for RegMatch',
      html: `<p>Your OTP is: <b>${otp}</b></p><p>It will expire in 5 minutes.</p>`
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in OTP process:", error);
    res.status(500).json({ error: "Failed to process OTP" });
  }
};

let verifyOTP = async (req, res) => {
  const { email, otp, crushData } = req.body;
  const rollNumber = email.split('.')[1].split('@')[0].toLowerCase();
  console.log(`otp in backend is ${otp}`);

  try {
    const DBotp = await otpModel.findOne({ email, otp });
    console.log(DBotp);

    if (!DBotp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (DBotp.expiresAt < Date.now()) {
      await otpModel.deleteOne({ _id: DBotp._id });
      return res.status(400).json({ error: "OTP has expired" });
    }

    await otpModel.deleteOne({ _id: DBotp._id });

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      const token = jwt.sign(
        { regNo: existingUser.regNo, email },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: 'Welcome back! Logged in again.',
        token: token,
        userData: {
          regNo: existingUser.regNo,
          email,
        }
      });
    }

    const newUser = await userModel.create({
      regNo: rollNumber,
      email,
      crushes: [...crushData],
      MatchedWith: []
    });

    if (newUser) {
      const jwtresp = jwt.sign(
        { regNo: newUser.regNo, email },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: "User created successfully",
        token: jwtresp,
        userData: {
          regNo: newUser.regNo,
          email: newUser.email,
        }
      });
    } else {
      return res.status(500).json({ error: "User creation failed" });
    }

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      error: error.code === 11000
        ? "Email/RegNo already exists"
        : "Internal server error"
    });
  }
};

let verifyToken = async (req, res) => {
  try {
    // If middleware passes, token is valid
    const user = await userModel.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Token is valid",
      userData: {
        regNo: user.regNo,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { Signup, verifyOTP, verifyToken };