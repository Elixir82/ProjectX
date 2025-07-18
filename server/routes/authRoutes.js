
const express = require('express');
const { Signup, verifyOTP, verifyToken } = require('../controllers/authController.js');
const authenticate = require('../middleware/authmiddleware.js');

const router = express.Router();

router.post('/signup', Signup);
router.post('/verify', verifyOTP);
router.get('/verify-token', authenticate, verifyToken); 

module.exports = router;