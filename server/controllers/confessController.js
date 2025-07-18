const express = require('express');
const confessModel = require('../models/Confess.Model');

const Confess = async (req, res) => {
  const { confession } = req.body;

  if (!confession) {
    return res.status(400).json({ message: "Please write a confession before submitting." });
  }

  try {
    const newConfession = await confessModel.create({ confession });

    return res.status(200).json({
      message: "Confession added successfully",
      confession: newConfession.confession,
      createdAt: newConfession.createdAt
    });

  } catch (error) {
    console.error("Confession error:", error.message);
    return res.status(500).json({ message: "Internal server error while adding confession" });
  }
};

const getConfessions = async (req, res) => {
  try {
    
    const confessions = await confessModel.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Confession retrieval successful",
      confessions
    });

  } catch (error) {
    console.error("Confession retrieval error:", error.message);
    return res.status(500).json({
      message: "Internal server error while retrieving confessions"
    });
  }
};

module.exports = {Confess,getConfessions};
