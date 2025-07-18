const express=require('express');
const router=express.Router();
const { postRant, getRants }=require('../controllers/rantController.js');

router.post('/',postRant);
router.get('/',getRants);

module.exports=router;

