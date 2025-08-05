const express=require('express');
const router=express.Router();
const { postRant, getRants,frcounts, testfr}=require('../controllers/rantController.js');

router.post('/',postRant);
router.get('/',getRants);
router.get('/:id',frcounts);
router.get('/test',testfr);
module.exports=router;

