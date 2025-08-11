let express = require('express');
let router=express.Router();
let {getTopComments, getCommentReplies, createComment} = require('../controllers/commentController.js');

router.get('/top',getTopComments);
router.get('/replies',getCommentReplies);
router.post('/',createComment);

module.exports=router;

