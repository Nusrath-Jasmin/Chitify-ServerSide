const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilioFn = require("../Utilities/twilio");

const secretKey = process.env.SECRET_KEY;

// singnup form submission/otp generation
const signup = async (req, res) => {
  const { phone } = req.body;
  const exist = await UserModel.findOne({ phone });
  if (exist) {
    res.json({ exist: true,otpsend:false, message: "user already exist.Please login to continue" });
  } else {
    twilioFn.sendOtp(phone)
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
  const { firstName, lastName, email, password, phone, otp } = req.body;

  twilioFn.verifyOtp(phone,otp)
  .then(async (verificationCheck)=>{
    if (verificationCheck && verificationCheck.status === "approved") {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        firstName,
        lastName,
        password: hashedPassword,
        phone,
        email,
        phoneVerified:true
      });
  
      const savedUser = await newUser.save();
      if (savedUser) {
        const find=UserModel.findOne({phone})
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
    }
    else{
      res.json({ error: true, message: "otp does not match" });
  }
  })
  .catch(()=>{
    res.json({otpVerified:false})
  })
}

//login user form submission logic
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const exist = await UserModel.findOne({ phone });
    if (exist) {
      const isPasswordMatch = await bcrypt.compare(password, exist.password);
      if (isPasswordMatch) {
        const payload = { id: exist._id, userType: exist.userType };
        const token = jwt.sign(payload, secretKey);
        console.log("JWT Token:", token);
        res.  json({ token });
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
  const { phone } = req.body;
  const exist = await UserModel.findOne({ phone });

  if (exist) {
    twilioFn.sendOtpe(phone)
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
  const {phone,otp}=req.body
  twilioFn.verifyOtp(phone,otp)
    .then((verificationCheck)=>{
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
  const { phone,password}=req.body
  const newpassword= await bcrypt.hash(password, 10);

  const save=await UserModel.findOneAndUpdate({phone},{$set:{password:newpassword}})
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
