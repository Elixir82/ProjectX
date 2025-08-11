let express = require('express');
let router=express.Router();
let {getTopComments, getCommentReplies, createComment, getReplyCount} = require('../controllers/commentController.js');

router.get('/top',getTopComments);
router.get('/replies',getCommentReplies);
router.post('/',createComment);
router.get('/count', getReplyCount);
module.exports=router;

