const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authmiddleware.js');
const {addCrush,getCrushCount,getMyMatches,deleteCrush,getMyCrushes}=require('../controllers/matchContrller.js');

router.post('/', authenticate ,addCrush);
router.get('/count/:regNo', authenticate, getCrushCount);
router.get('/my-matches', authenticate, getMyMatches);
router.get('/crushes', authenticate, getMyCrushes);
router.delete('/:regNo', authenticate, deleteCrush);
module.exports=router