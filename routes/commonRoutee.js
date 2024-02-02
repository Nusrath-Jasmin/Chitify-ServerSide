const express = require("express");
const router = express.Router();
const commonController=require("../controllers/commonController")


// Route for signup
router.post('/signup',commonController.signup)

// verify otp
router.post('/verifyOtp',commonController.verifyOtp)


module.exports=router