const rantModel = require('../models/Rant.Model.js');
const confessModel = require('../models/Confess.Model.js');
const commentModel = require('../models/Comment.Model.js');

const getTopComments = async (req, res) => {
  const { postType, postId } = req.query;

  if (!postType || !postId) {
    return res.status(400).json({ message: "postType and postId are required" });
  }

  try {
    let parentPost;
    if (postType === 'rant') {
      parentPost = await rantModel.findById(postId);
    } else if (postType === 'confession') {
      parentPost = await confessModel.findById(postId);
    } else {
      return res.status(400).json({ message: "Invalid postType" });
    }

    if (!parentPost) {
      return res.status(404).json({ message: `${postType} not found` });
    }

    const topComments = await commentModel.find({
      parentPostId: postId,
      parentPostType: postType,
      depth: 0 
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Top comments retrieved",
      parentPost: {
        _id: parentPost._id,
        content: postType === 'rant' ? parentPost.rant : parentPost.confession
      },
      comments: topComments  
    });

  } catch (error) {
    console.error(`Error fetching ${postType} comments:`, error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message 
    });
  }
};

const getCommentReplies = async (req, res) => {
  const { parentCommentId  } = req.query;

  try {
    const replies = await commentModel
      .find({ parentCommentId: parentCommentId  })
      .sort({ createdAt: -1 });

    if (!replies || replies.length === 0) {
      return res.status(404).json({ message: "No replies found" });
    }

    res.status(200).json({ message: "Replies retrieved", replies });
  } catch (error) {
    console.error("Error retrieving replies:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const createComment = async (req, res) => {
  const { content, parentPostId, parentPostType, parentCommentId = null } = req.body;

  if (!content || !parentPostId || !parentPostType) {
    return res.status(400).json({ message: "content, parentPostId, and parentPostType are required" });
  }

  try {
    let depth = 0;
    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      depth = parentComment.depth + 1;
      if (depth > 2) { 
        return res.status(400).json({ message: "Cannot nest replies beyond 2 levels" });
      }
    }

    const newComment = await commentModel.create({
      content,
      parentPostId,
      parentPostType,
      parentCommentId,
      depth,
      replyCount: 0
    });

    if (parentCommentId) {
      await commentModel.findByIdAndUpdate(parentCommentId, {
        $inc: { replyCount: 1 }
      });
    }

    res.status(201).json({
      message: depth === 0 ? "Comment posted" : "Reply posted",
      comment: newComment
    });

  } catch (error) {
  console.error("Comment creation failed:", error.message);
  res.status(500).json({ message: "Internal server error" });
}
};

const getReplyCount = async (req, res) => {
  const { parentPostId, parentPostType } = req.query;

  if (!parentPostId || !parentPostType) {
    return res.status(400).json({ 
      message: "parentPostId and parentPostType are required", 
      count: 0 
    });
  }

  try {
    const count = await commentModel.countDocuments({
      parentPostId: parentPostId,
      parentPostType: parentPostType,
      depth: 0  
    });

    res.status(200).json({
      message: "Comment count retrieved successfully", 
      count: count
    });

  } catch (error) {
    console.error("Error while counting comments:", error);
    res.status(500).json({
      message: "Internal server error while counting comments", 
      count: 0
    });
  }
};


module.exports ={getTopComments, getCommentReplies, createComment, getReplyCount}