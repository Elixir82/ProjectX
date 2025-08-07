const express=require('express');
const router=express.Router();
const { postRant, getRants,frcounts, frdeletecounts}=require('../controllers/rantController.js');

router.post('/',postRant);
router.get('/',getRants);
router.put('/:id',frcounts);
router.delete('/:id',frdeletecounts);
module.exports=router;

