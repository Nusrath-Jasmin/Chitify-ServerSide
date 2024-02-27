const express = require("express");
const router = express.Router();
const userController=require("../controllers/chitController")
const authenticateToken=require("../middlewares/authenticateToken")

// to send otp to email
router.post('/confirmEmail',authenticateToken, userController.sendEmailOtp)

//verify otp
router.post('/verifyEmailOtp',authenticateToken,userController.verifyEmailOtp)

// checkEmailverifiedOrNot
router.get('/checkEmailverifiedOrNot',authenticateToken,userController.checkEmailverifiedOrNot)

//applyForChitOwnership
router.post('/applyForChitOwnership',authenticateToken,userController.applyForChitOwnership)

//RequestSubmittedorNot
router.get('/RequestSubmittedorNot',authenticateToken,userController.RequestSubmittedorNot)

//isOwner
router.get('/isOwner',authenticateToken,userController.isOwner)

//RegisterChit
router.post('/RegisterChit',authenticateToken,userController.RegisterChit)

// OwnedChitties
router.get('/OwnedChitties',authenticateToken,userController.OwnedChitties)

// UpdateChitty
router.put('/UpdateChitty',authenticateToken,userController.UpdateChitty)

//delete chitty
router.delete('/DeleteChitty/:id',authenticateToken,userController.DeleteChitty)

//get all open chitties
router.get('/openChitties',authenticateToken,userController.OpenChitties)

//check the user is already a member
router.get('/IsAMember',authenticateToken,userController.IsAMember)

//check for request
router.get('/IsRequested',authenticateToken,userController.isRequested)

//submit request to join a chitty
router.post('/SubmitRequest',authenticateToken,userController.SubmitRequest)

//get requests
router.get('/getRequests/:id',authenticateToken,userController.getRequests)

//get user details
router.get('/getUser/:id',authenticateToken,userController.getUser)


module.exports=router