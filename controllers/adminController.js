const nodemailer = require("nodemailer");
const requestModel = require("../models/RequestForAdmin");
const UserModel = require("../models/userModel");
const OwnerModel = require("../models/OwnerModel");

const getAllRequest = async (req, res) => {
  const request = await requestModel.find();
  console.log(request);
  res.send(request);
};

const getUserDetails = async (req, res) => {
  const _id = req.body.userid;
  console.log(req.body);
  const user = await UserModel.findById(_id);
  console.log(user, "hai");
  res.send(user);
};

const AddAsOwner = async (req, res) => {
  console.log(req.body);
  const _id = req.body.requestid;
  const details = await requestModel.findById(_id);
  console.log("details", details);
  if (details) {
     var newOwner = new OwnerModel({
      userId: details.userId,
      street: details.street,
      city: details.city,
      state: details.state,
      pin: details.pin,
      country: details.country,
      accepted: true,
    });
  }

  const save = await newOwner.save();
  if (save) {
    await requestModel.findByIdAndDelete(_id);
    res.json({ owner: true });
  } else {
    res.json({ owner: false });
  }
};

const RejectRequest= async (req,res)=>{
    const _id = req.body.requestid;
    
    const details = await requestModel.findById(_id);
    console.log(details);
    if(details){
    const userId=details.userId
    const user= await UserModel.findOne({_id:userId})
    console.log(user);
   if(user){
    const email=user.email;
    
    const transporter = nodemailer.createTransport({
        service: "Gmail", 
        auth: {
          user: process.env.MAIL,
          pass: process.env.PASSWORD,
        },
      });
    
      // Define email content
      const mailOptions = {
        from: process.env.MAIL, 
        to: email, 
        subject: "Rejection", 
        text: "Your application for starting a chit in chitify is being rejected. Your identity is not valid and hence the request is rejected.If you want to contact the admin you can connect with email.", 
      };
    
      // Send email
      try {
        const info = await transporter.sendMail(mailOptions);
        await requestModel.findByIdAndDelete(_id);
        console.log("mail send");
      } catch (error) {
        res.status(500).json({ message:"rejection failed" });
      }
    }}
}

module.exports = {
  getAllRequest,
  getUserDetails,
  AddAsOwner,
  RejectRequest
};
