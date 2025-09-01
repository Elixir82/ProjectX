const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  parentPostId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'parentPostType'
  },
  parentPostType: {
    type: String,
    required: true,
    enum: ['rant', 'confession']
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  depth: {
    type: Number,
    required: true,
    min: 0,
    max: 2 
  },
  replyCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

commentSchema.index({ parentPostId: 1, depth: 1 }); 
commentSchema.index({ parentCommentId: 1 });      
commentSchema.index({ createdAt: -1 });          

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;