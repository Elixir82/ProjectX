const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  // Parent post reference (Rant or Confession)
  parentPostId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'parentPostType'
  },
  // Dynamic reference to either Rant or Confession
  parentPostType: {
    type: String,
    required: true,
    enum: ['Rant', 'Confession']
  },
  // For replies (null if top-level)
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  // Track nesting level (0 = top-level, 1 = reply to top-level, etc.)
  depth: {
    type: Number,
    required: true,
    min: 0,
    max: 2 // Limits nesting to 2 levels
  },
  // For showing "X replies" badges
  replyCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// === Critical Performance Indexes ===
commentSchema.index({ parentPostId: 1, depth: 1 }); // For fetching top-level comments
commentSchema.index({ parentCommentId: 1 });        // For fetching replies
commentSchema.index({ createdAt: -1 });            // For sorting by newest

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;