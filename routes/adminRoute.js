const express = require("express");
const router = express.Router();
const adminController=require("../controllers/adminController")
const authenticateToken=require("../middlewares/authenticateToken")

//get all request
router.get('/getAllRequest',authenticateToken,adminController.getAllRequest)

//getUserDetails
router.post('/getUserDetails',authenticateToken,adminController.getUserDetails)

//AddAsOwner
router.post('/AddAsOwner',authenticateToken,adminController.AddAsOwner)

//RejectRequest
router.post('/RejectRequest',authenticateToken,adminController.RejectRequest)

//list all users
router.get('/list-users',authenticateToken,adminController.listUsers)

//list all chits
router.get('/list-chits',authenticateToken,adminController.listChits)


module.exports=router