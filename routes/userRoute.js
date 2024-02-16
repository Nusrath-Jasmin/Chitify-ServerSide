const express = require("express");
const router = express.Router();
const userController=require("../controllers/userController")
const authenticateToken=require("../middlewares/authenticateToken")

// Apply middleware to all routes starting with '/user'
// router.use('/user', authenticateToken);

// to send otp to email
router.post('/confirmEmail',authenticateToken, userController.sendEmailOtp)

//verify otp
router.post('/verifyEmailOtp',authenticateToken,userController.verifyEmailOtp)

// checkEmailverifiedOrNot
router.get('/checkEmailverifiedOrNot',authenticateToken,userController.checkEmailverifiedOrNot)

module.exports=router