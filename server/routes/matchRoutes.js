const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authmiddleware.js');
const {MatchOrNot,getCrushCount,getMyMatches}=require('../controllers/matchContrller.js');

router.post('/', authenticate ,MatchOrNot);
router.get('/count/:regNo', authenticate, getCrushCount);
router.get('/my-matches', authenticate, getMyMatches);

module.exports=router