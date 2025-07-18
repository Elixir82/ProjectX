const express=require('express');
const router=express.Router();
const {Confess,getConfessions}=require('../controllers/confessController.js');
router.post('/',Confess);
router.get('/',getConfessions)

module.exports=router;