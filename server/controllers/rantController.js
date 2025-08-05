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

const frcounts = async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await rantModel.findById(id);
    if (resp) {
      resp.forRealCount = (resp.forRealCount || 0) + 1;
      await resp.save();
      return res.status(200).json({ message: "Up voted", count: resp.forRealCount });
    } else {
      return res.status(404).json({ message: "Could not find the rant with id" });
    }
  } catch (error) {
    console.error("Error updating forRealCount:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const testfr=(req,res)=>{
  res.status(200).json({message: "Test passed"});
}

module.exports = { postRant, getRants, frcounts, testfr};
