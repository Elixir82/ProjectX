const userModel = require('../models/User.Model.js');

const addCrush = async (req, res) => {
  try {
    const { crushRegNo, crushName } = req.body;
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.crushes.length >= 5) {
      return res.status(400).json({ error: "Maximum 5 crushes allowed" });
    }

    const existsInCrushes = user.crushes.some(c => c.regNo === crushRegNo);
    const existsInMatches = user.MatchedWith.includes(crushRegNo);
    if (existsInCrushes || existsInMatches) {
      return res.status(400).json({ error: "This crush already exists in your list" });
    }

    if (crushRegNo === user.regNo) {
      return res.status(400).json({ error: "Are you a retard ?" });
    }

    const crushUser = await userModel.findOne({ regNo: crushRegNo });
    let isMatch = false;

    if (crushUser) {
      isMatch = crushUser.crushes.some(c => c.regNo === user.regNo);
      if (isMatch) {
        if (!user.MatchedWith.includes(crushRegNo)) {
          user.MatchedWith.push(crushRegNo);
        }
        if (!crushUser.MatchedWith.includes(user.regNo)) {
          crushUser.MatchedWith.push(user.regNo);
          await crushUser.save();
        }
      }
    }

    if (!isMatch) {
      user.crushes.push({ regNo: crushRegNo, name: crushName });
    }

    await user.save();

    res.json({
      success: true,
      isMatch,
      updatedCrushes: user.crushes,
      updatedMatches: user.MatchedWith
    });

  } catch (error) {
    console.error("Add crush error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCrush = async (req, res) => {
  try {
    const { regNo } = req.params;
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const initialCount = user.crushes.length;
    user.crushes = user.crushes.filter(c => c.regNo !== regNo);

    if (user.crushes.length === initialCount) {
      return res.status(404).json({ error: "Crush not found in your list" });
    }

    await user.save();
    res.json({ success: true, updatedCrushes: user.crushes });

  } catch (error) {
    console.error("Delete crush error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCrushCount = async (req, res) => {
  try {
    const { regNo } = req.params;
    // Find how many users have this regNo in their crushes array
    const count = await userModel.countDocuments({ 
      "crushes.regNo": regNo 
    });
    res.json({ count });
  } catch (error) {
    console.error("Error getting crush count:", error);
    res.status(500).json({ error: "Failed to get crush count" });
  }
};

const getMyCrushes = async (req, res) => {
  try {
    const user = req.user;
    res.json({ crushes: user.crushes });
  } catch (error) {
    console.error("Error getting crushes:", error);
    res.status(500).json({ error: "Failed to get crushes" });
  }
};

const getMyMatches = async (req, res) => {
  try {
    // req.user is populated by authMiddleware
    const user = req.user;
    res.json({ matchedWith: user.MatchedWith });
  } catch (error) {
    res.status(500).json({ error: "Cannot retrieve matches" });
  }
};


module.exports = { addCrush, deleteCrush, getCrushCount, getMyMatches, getMyCrushes};
