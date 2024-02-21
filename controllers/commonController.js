const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtp = require("../Verification/otpSend");

const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.ACCOUNTSIDTWILIO;
const authId = process.env.AUTHTOCKENTWILIO;
const serviceSid = process.env.SERVICESIDTWILIO;
const secretKey = process.env.SECRET_KEY;

const client = twilio(accountSid, authId);

// singnup form submission/otp generation
const signup = async (req, res) => {

  console.log(req.body);
  const { phone } = req.body;
  const exist = await User.findOne({ phone });

  if (exist) {
    res.json({ exist: true,otpsend:false, message: "user already exist.Please login to continue" });
  } else {
    sendOtp.otpgenerate(phone)
      .then(() => {
        res.json({ otpsend: true, message: "otp send successfully" });
      })
      .catch(() => {
        res.json({ otpsend: false, message: "otp send failed" });
      });
  }
};

// otp verification logic
const verifyOtp = async (req, res) => {

  console.log(req.body);

  const { firstName, lastName, email, password, phone, otp } = req.body;

  // verification check
  const verificationCheck = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: `+91${phone}`, code: otp });

  if (verificationCheck && verificationCheck.status === "approved") {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      password: hashedPassword,
      phone,
      email,
      phoneVerified:true
    });

    const savedUser = await newUser.save();
    console.log("saved",savedUser);
    if (savedUser) {

      const find=User.findOne({phone})
      console.log("finded",find,find._id,find.userType);
      const payload = { id:savedUser._id, userType:savedUser.userType};
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      res.json({
        token:token,
        success: true,
        error: false,
        user: true,
        message: "successfully verified user",
      });
    }
  } else {
    res.json({ error: true, message: "otp does not match" });
  }
};

//login user form submission logic
const login = async (req, res) => {

  console.log(req.body);

  try {
    const { phone, password } = req.body;
    const exist = await User.findOne({ phone });

    if (exist) {
      const isPasswordMatch = await bcrypt.compare(password, exist.password);

      if (isPasswordMatch) {
        const payload = { id: exist._id, userType: exist.userType };
        const token = jwt.sign(payload, secretKey);
        console.log("JWT Token:", token);
        res.json({ token });
      } else {
        res.json({ error: true, message: "incorrect password" });
      }
    } else {
      res.json({error:true, message: "invalid credentials" });
    }
  } catch (error) {
    res.json({ error: true, message: "error during login" });
  }
};

//forgotPasswordSendOtp
const forgotPasswordSendOtp= async (req,res)=>{
  console.log('phone',req.body)

  const { phone } = req.body;
  const exist = await User.findOne({ phone });

  if (exist) {
    sendOtp.otpgenerate(phone)
      .then(() => {
        phoneToVerify=phone
        res.json({ otpsend: true, message: "otp send successfully",phone:phone});
      })
      .catch(() => {
        res.json({ otpsend: false, message: "otp send failed" });
      });
  }
  else{
    res.json({otpsend:false,message:"no user found"})
  }
}

// verifyUser
const verifyUser= async (req,res)=>{

  console.log("user verify",req.body);
  const {phone,otp}=req.body
  sendOtp.verifyOtp(phone,otp)
    .then((verificationCheck)=>{
      console.log("verificationController",verificationCheck);
      if (verificationCheck && verificationCheck.status === "approved") {
        res.json({otpVerified:true})
      }
      else{
        res.json({otpVerified:false})
      }
    })
    .catch(()=>{
      res.json({otpVerified:false})
    })
}


// update password
const UpdatePassword= async (req,res)=>{
  console.log("req",req.body)
  const { phone,password}=req.body
  const newpassword= await bcrypt.hash(password, 10);

  const save=await User.findOneAndUpdate({phone},{$set:{password:newpassword}})
  if(save){
    console.log("password updated")
    res.json({updated:true,message:"password updated"})
  }
  else{
    res.json({updated:false,message:"error changing password"})
  }

}

module.exports = {
  signup,
  verifyOtp,
  login,
  forgotPasswordSendOtp,
  verifyUser,
  UpdatePassword
};
