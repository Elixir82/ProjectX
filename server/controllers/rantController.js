const rantModel = require('../models/Rant.Model.js');
const commentModel = require('../models/Comment.Model.js');
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
    
    // Add comment counts to each rant
    const rantsWithCounts = await Promise.all(
      rants.map(async (rant) => {
        const commentCount = await commentModel.countDocuments({
          parentPostId: rant._id,
          parentPostType: 'rant',
          depth: 0  
        });
        
        return {
          ...rant.toObject(),
          commentCount: commentCount
        };
      })
    );

    return res.status(200).json({ 
      message: "Rants fetched", 
      rants: rantsWithCounts 
    });
  } catch (error) {
    console.error("Get Rant Error:", error.message);
    return res.status(500).json({ message: "Failed to fetch rants" });
  }
};

const frcounts = async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await rantModel.findByIdAndUpdate(
      id,
      { $inc: { forRealCount: 1 } },
      { new: true }
    );

    if (resp) {
      return res.status(200).json({ message: "Up voted", count: resp.forRealCount });
    } else {
      return res.status(404).json({ message: "Could not find the rant with id" });
    }
  } catch (error) {
    console.error("Error updating forRealCount:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const frdeletecounts = async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await rantModel.findById(id);
    if (resp) {
      const newCount = Math.max((resp.forRealCount || 0) - 1, 0);
      resp.forRealCount = newCount;
      await resp.save();
      return res.status(200).json({ message: "Down voted", count: resp.forRealCount });
    } else {
      return res.status(404).json({ message: "Could not find the rant with id" });
    }
  } catch (error) {
    console.error("Error updating forRealCount:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { postRant, getRants, frcounts, frdeletecounts };
