const UserModel = require("../models/userModel");
const RequestModel = require("../models/RequestForAdmin");
const nodemailer = require("nodemailer");
const OwnerModel = require("../models/OwnerModel");
const Chitty = require("../models/ChitModel");
const Participants=require("../models/participants")
const Request=require("../models/RequestToJoin");
const User = require("../models/userModel");

let otp = "";
// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const sendEmailOtp = async (req, res) => {
  const userId = req.user.id;
  const exist = await UserModel.findOne({ _id: userId });
  const email = exist.email;
  otp = generateOTP().toString();

  // Configure Nodemailer
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
    subject: "otp for email verification",
    text: otp,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

//verify email otp
const verifyEmailOtp = async (req, res) => {
  if (req.body.otp === otp) {
    res.json({ error: false });
    const user = await UserModel.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { emailVerified: true } },
      { new: true }
    );
  } else {
    res.json({ error: true });
  }
};

//checkEmailverifiedOrNot
const checkEmailverifiedOrNot = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.user.id });
  console.log(req.user.id);
  console.log(user.emailVerified, user.email);
  if (user.emailVerified) {
    res.json({ email: true });
  } else {
    res.json({ email: false });
  }
};

//applyForChitOwnership
const applyForChitOwnership = async (req, res) => {
  console.log(req.body, req.user.id);
  const userId = req.user.id;
  const { street, city, state, pin, country } = req.body;
  const newRequest = new RequestModel({
    userId,
    street,
    city,
    state,
    pin,
    country,
  });
  const save = await newRequest.save();
  if (save) {
    res.json({ requestSaved: true });
  } else {
    res.json({ requestSaved: false });
  }
};

const RequestSubmittedorNot = async (req, res) => {
  const userId = req.user.id;
  const isRequest = await RequestModel.findOne({ userId });
  console.log(isRequest, "isrequest");
  if (isRequest) {
    res.json({ accepted: true });
  } else {
    res.json({ accepted: false });
  }
};

const isOwner = async (req, res) => {
  // const userId=req.user.id;
  const owner = await OwnerModel.findOne({ userId: req.user.id });
  console.log(owner);
  if (owner) {
    res.json({ owner: true });
  } else {
    res.json({ owner: false });
  }
};

const RegisterChit = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      chitName,
      duration,
      totalAmount,
      monthlyPayment,
      participants,
      chitType,
      startDate,
    } = req.body;

    const newChitty = new Chitty({
      userId,
      chitName,
      duration,
      totalAmount,
      monthlyPayment,
      participants,
      chitType,
      startDate,
    });

    await newChitty.save();
    res
      .status(201)
      .json({ message: "Chitty created successfully", submitted: true });
  } catch (error) {
    console.error("Error saving chitty:", error);
    res.status(500).json({ message: "Error saving chitty", submitted: false });
  }
};

const OwnedChitties = async (req, res) => {
  try {
    const userId = req.user.id;
    const chitties = await Chitty.find({ userId });
    console.log(chitties);
    res.send(chitties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateChitty = async (req, res) => {
  const { _id, ...update } = req.body;

  try {
    const updatedChitty = await Chitty.findByIdAndUpdate(_id, update, {
      new: true,
    });
    return res.status(200).json(updatedChitty);
  } catch (error) {
    console.error("Error updating chitty:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteChitty = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedChitty = await Chitty.findByIdAndDelete(id);

    if (!deletedChitty) {
      return res.status(404).json({ message: true });
    }

    return res.status(200).json({ message: false });
  } catch (error) {
    console.error("Error deleting chitty:", error);
    return res.status(500).json({ message: true });
  }
};

const OpenChitties = async (req, res) => {
  const currentDate = new Date();
  const chitties = await Chitty.find({
    chitType: "public",
    startDate: { $gt: currentDate },
  });
  console.log(chitties);
  res.send(chitties)
};

const IsAMember= async (req,res)=>{
console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
const userId = req.user.id;
await Participants.findOne({ participants: { $in: [userId] } })
  .then(participant => {
    if (participant) {
      console.log('User is in the participants array.');
      req.json({participant:true})
    } else {
      console.log('User is not in the participants array.');
      res.json({participant:false})
    }
  })
  .catch(error => {
    console.error('Error:', error);
    res.json({participant:false})
  });
}

const isRequested=async (req,res)=>{
 const userId = req.user.id;

await Request.findOne({ requestedUsers: { $in: [userId] } })
  .then(request => {
    if (request) {
      console.log('User is in the requests array.');
      res.json({request:true})
    } else {
      console.log('User is not in the requests array.');
      res.json({request:false})
    }
  })
  .catch(error => {
    console.error('Error:', error);
    res.send(error)
  });
}

const SubmitRequest=async(req,res)=>{
  console.log(req.body,"llllllllllllllllllllllll")
  try{
  const userId=req.user.id;
  const chitId=req.body.id;
  let requestToJoin= await Request.findOne({ chitId });

  if (!requestToJoin) {
    requestToJoin = new Request({
      chitId,
      requestedUsers: [userId],
  })
  await requestToJoin.save();
  res.json({success:true})
}else{
  requestToJoin.requestedUsers.push(userId);
  await requestToJoin.save();
  console.log('Request added to requestedUsers successfully');
  res.json({success:true})
}
} catch (error) {
  console.error('Error creating request:', error);
  res.status(500).json({ success: false, message: 'An error occurred while saving the request' });
}
}

const getRequests=async (req,res)=>{
  const chitId = req.params.id;
  const request=await Request.find({chitId})
  console.log(request[0].requestedUsers);
  res.json(request[0].requestedUsers)
}

const getUser= async(req,res)=>{
  const _id = req.params.id;
  console.log(_id);
  const user=await  User.findById(_id)
  console.log(user);
  res.send(user)
}

module.exports = {
  sendEmailOtp,
  verifyEmailOtp,
  checkEmailverifiedOrNot,
  applyForChitOwnership,
  RequestSubmittedorNot,
  isOwner,
  RegisterChit,
  OwnedChitties,
  UpdateChitty,
  DeleteChitty,
  OpenChitties,
  IsAMember,
  isRequested,
  SubmitRequest,
  getRequests,
  getUser
};
