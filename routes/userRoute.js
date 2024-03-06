const express = require("express");
const router = express.Router();
const userController=require("../controllers/chitController")
const authenticateToken=require("../middlewares/authenticateToken")
const upload=require("../Utilities/s3")

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
router.get('/IsAMember/:id',authenticateToken,userController.IsAMember)

//check for request
router.get('/IsRequested/:id',authenticateToken,userController.isRequested)

//submit request to join a chitty
router.post('/SubmitRequest',authenticateToken,userController.SubmitRequest)

//get requests
router.get('/getRequests/:id',authenticateToken,userController.getRequests)

//get user details
router.get('/getUser/:id',authenticateToken,userController.getUser)

//accept request to join chit
router.post('/AcceptRequest',authenticateToken,userController.AcceptRequest)

//reject request
router.put('/RejectRequest',authenticateToken,userController.rejectRequest)

//get all participants
router.get('/getParticipants/:id',authenticateToken,userController.getParticipants)

//remove user from participants
router.post('/removeUser',authenticateToken,userController.removeUserFromParticipants)

//get users not in participants of the chit
router.get('/getUsersToAdd/:id',authenticateToken,userController.findUsersNotInParticipants)

//send invitaation to user to join in chit
router.post('/sendInvitation',authenticateToken,userController.sendInvitation)

// Route to fetch invitations for a specific user
router.get('/invitations',authenticateToken, userController.getInvitationsForUser);

//accept invitation
router.post('/acceptInvitation',authenticateToken,userController.acceptInvitation)

//reject invitation
router.post('/rejectInvitation',authenticateToken,userController.rejectInvitation)

//update profile
router.post('/updateProfile',upload.single("file"),authenticateToken,userController.updateProfile)

//get user profile
router.get('/userProfile',authenticateToken,userController.userProfile)

//list all joined chits
router.get('/allJoinedChits',authenticateToken,userController.getUserJoinedChits)

module.exports=router