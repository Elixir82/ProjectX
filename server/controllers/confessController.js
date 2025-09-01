const express = require('express');
const confessModel = require('../models/Confess.Model');
const commentModel = require('../models/Comment.Model.js');
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
    const confessions = await confessModel.find().sort({ createdAt: -1 });
    const confessionsWithCounts = await Promise.all(
      confessions.map(async (confession) => {
        const commentCount = await commentModel.countDocuments({
          parentPostId: confession._id,
          parentPostType: 'confession',
          depth: 0
        });
        
        return {
          ...confession.toObject(),
          commentCount: commentCount
        };
      })
    );

    res.status(200).json({
      message: "Confessions retrieved",
      confessions: confessionsWithCounts
    });
  } catch (error) {
    console.log(`Error in fetching confessions ${error}`);
  }
};

module.exports = {Confess,getConfessions};
