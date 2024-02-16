const User = require("../models/userModel");

const nodemailer = require("nodemailer");

let otp = "";
// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const sendEmailOtp = async (req, res) => {
  console.log(req.user);
  const userId = req.user.id;
  const exist = await User.findOne({ _id: userId });
  const email = exist.email;
  otp = generateOTP().toString();
  console.log("otp", typeof otp, typeof email);
  // const status = await sendEmail(email,otp,res)

  console.log(process.env.MAIL + "    " + process.env.PASSWORD);
  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail", // email service
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Define email content
  const mailOptions = {
    from: process.env.MAIL, // Sender address
    to: email, // List of recipients
    subject: "otp for email verification", // Subject line
    text: otp, // Plain text body
  };


  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

//verify email otp
const verifyEmailOtp=async (req,res)=>{
  console.log("otpentered",req.body)
  if(req.body.otp === otp){
    res.json({error:false})
    const user=await User.findOneAndUpdate({_id:req.user.id},{$set:{emailVerified:true}},{new:true})
    console.log(user);
  }else{
    res.json({error:true})
  }
}


//checkEmailverifiedOrNot
const checkEmailverifiedOrNot=async(req,res)=>{
  const user=await User.find({_id:req.user.id})
  if(user.emailVerified){
    res.json({email:true})
  }else{
    res.json({email:false})
  }
}


module.exports = {
  sendEmailOtp,
  verifyEmailOtp,
  checkEmailverifiedOrNot
};
