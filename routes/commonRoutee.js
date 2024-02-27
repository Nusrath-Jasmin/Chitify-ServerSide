const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");

// Route for signup or to send otp
router.post("/signup", commonController.signup);

// verify otp
router.post("/verifyOtp", commonController.verifyOtp);

// login user
router.post("/login", commonController.login);

//forgot password
router.post("/forgotPassword",commonController.forgotPasswordSendOtp)

//forgot password verify otp
router.post('/verify-user',commonController.verifyUser)

// updatepassword
router.post('/update-password',commonController.UpdatePassword)

module.exports = router;
