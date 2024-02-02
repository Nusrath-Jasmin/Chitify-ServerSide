const User = require("../models/userModel");
const sendOtp=require('../Verification/otpSend')
require('dotenv').config();
const accountSid=process.env.ACCOUNTSIDTWILIO;
const authId=process.env.AUTHTOCKENTWILIO;
const serviceSid=process.env.SERVICESIDTWILIO;
const countryCode=process.env.COUNTRYCODE;
const twilio =require('twilio');
const client=twilio(accountSid, authId);

const signup=async (req,res)=>{

    console.log(req.body)

    const {firstName,lastName,email,password,phone}=req.body

    const exist=await User.findOne({phone});

    if(exist){
        res.json({exist:true,message: 'user already exist.please login'});
    }else{
      sendOtp(phone)
          .then((msg)=>{
            res.json({otpsend: true, message: 'otp send successfully'});
          })
          .catch((err)=>{
            res.json({otpsend: false, message: 'otp send failed'});
          });
    }

   

    
}

const verifyOtp=async(req,res)=>{

    console.log(req.body)

    const {firstName,lastName,email,password,phone,otp}=req.body

    // verification check
    const verificationCheck =await client.verify.v2.services(serviceSid)
    .verificationChecks.create({to: `+91${phone}`, code: otp});

    if (verificationCheck && verificationCheck.status==='approved') {
         const newUser = new User({
        firstName,
        lastName,
        password,
        phone,
        email
      });

      const savedUser = await newUser.save();

        
      if(savedUser){
        res.json({
          success: true,
          user: true,
          message: 'successfully verified user',
        });
        }


}}

module.exports={
    signup,
    verifyOtp
}