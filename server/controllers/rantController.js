const rantModel = require('../models/Rant.Model.js');

const postRant = async (req, res) => {
  const { rant } = req.body;
  if (!rant) {
    return res.status(400).json({ message: "Please write something before submitting." });
  }

  try {
    const newRant = await rantModel.create({ rant });
    return res.status(200).json({
      message: "Rant added successfully",
      rant: newRant.rant,
      createdAt: newRant.createdAt
    });
  } catch (error) {
    console.error("Post Rant Error:", error.message);
    return res.status(500).json({ message: "Failed to add rant" });
  }
};

const getRants = async (req, res) => {
  try {
    const rants = await rantModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ message: "Rants fetched", rants });
  } catch (error) {
    console.error("Get Rant Error:", error.message);
    return res.status(500).json({ message: "Failed to fetch rants" });
  }
};

module.exports = { postRant, getRants };
