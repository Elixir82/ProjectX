const userModel = require('../models/User.Model.js');

let MatchOrNot = async (req, res) => {
  const { crushes, user } = req.body;

  try {
    const thisuser = await userModel.findOne({ email: user.email });
    if (!thisuser) {
      return res.status(404).json({ error: "User not found" });
    }

    thisuser.crushes = crushes;
    let newMatches = [];

    for (let crushRegNo of crushes) {
      const thiscrush = await userModel.findOne({ regNo: crushRegNo });
      if (!thiscrush) continue;


      const isMutual = thiscrush.crushes.includes(thisuser.regNo);

      if (isMutual) {

        if (!thiscrush.MatchedWith.includes(thisuser.regNo)) {
          thiscrush.MatchedWith.push(thisuser.regNo);
        }

        if (!thisuser.MatchedWith.includes(thiscrush.regNo)) {
          thisuser.MatchedWith.push(thiscrush.regNo);
        }


        thisuser.crushes = thisuser.crushes.filter(c => c !== thiscrush.regNo);
        thiscrush.crushes = thiscrush.crushes.filter(c => c !== thisuser.regNo);


        await thiscrush.save();
        newMatches.push(thiscrush.regNo);
      }
    }

    await thisuser.save();

    return res.status(200).json({
      message: "Crushes submitted successfully",
      matchedWith: thisuser.MatchedWith,
      remainingCrushes: thisuser.crushes,
      newMatches
    });

  } catch (error) {
    console.error("Match error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCrushCount = async (req, res) => {
  try {
    const { regNo } = req.params;
    // Find how many users have regNo in their crushes list
    const count = await userModel.countDocuments({ crushes: regNo });
    res.json({ count });
  } catch (error) {
    console.error("Error getting crush count:", error);
    res.status(500).json({ error: "Failed to get crush count" });
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


module.exports = {MatchOrNot,getCrushCount,getMyMatches};
