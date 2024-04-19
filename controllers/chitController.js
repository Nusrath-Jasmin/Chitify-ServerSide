const UserModel = require("../models/userModel");
const RequestModel = require("../models/RequestForAdmin");
const nodemailer = require("nodemailer");
const OwnerModel = require("../models/OwnerModel");
const Chitty = require("../models/ChitModel");
const Participants = require("../models/participants");
const Request = require("../models/RequestToJoin");
const User = require("../models/userModel");
const Invitation = require("../models/Invitation");
const Payment = require("../models/paymentModel");
const Winner=require('../models/winners')

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
      lotDate,
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
      lotDate,
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
  console.log("updating");
  console.log(req.body, "hai");
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
    const chittyToDelete = await Chitty.findById(id);
    const currentDate = new Date();
    if (chittyToDelete.startDate <= currentDate) {
      return res.status(400).json({ message: true });
    }

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
  res.send(chitties);
};

// const IsAMember = async (req, res) => {
//   const chitId=req.params.id;
//   console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
//   const userId = req.user.id;
//   await Participants.findOne({ participants: { $in: [userId] } })
//     .then((participant) => {
//       if (participant) {
//         console.log("User is in the participants array.");
//         res.json({ participant: true });
//       } else {
//         console.log("User is not in the participants array.");
//         res.json({ participant: false });
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       res.json({ participant: false });
//     });
// };

const IsAMember = async (req, res) => {
  const chitId = req.params.id;
  const userId = req.user.id;

  try {
    const participant = await Participants.findOne({
      chitId: chitId,
      participants: { $in: [userId] },
    });

    if (participant) {
      console.log("User is in the participants array for chitId:", chitId);
      res.json({ participant: true });
    } else {
      console.log("User is not in the participants array for chitId:", chitId);
      res.json({ participant: false });
    }
  } catch (error) {
    console.error("Error:", error);
    res.json({ participant: false });
  }
};

// const isRequested = async (req, res) => {
//   const userId = req.user.id;
//   const chitId = req.params.id

//   await Request.find(
//     { requestedUsers: { $elemMatch: { user: userId } } },
//     { "requestedUsers.$": 1, status: 1 }
//   )
//   .then(request => {
//     if (request && request.length > 0) {
//       console.log('User is in the requests array.');
//       console.log(request);
//       res.json({ request: true, data: request });
//     } else {
//       console.log('User is not in the requests array.');
//       res.json({ request: false ,data:[]});
//     }
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     res.send(error);
//   });
// };

const isRequested = async (req, res) => {
  const userId = req.user.id;
  const chitId = req.params.id;

  try {
    const request = await Request.find(
      { chitId: chitId, requestedUsers: { $elemMatch: { user: userId } } },
      { "requestedUsers.$": 1, status: 1 }
    );

    if (request && request.length > 0) {
      console.log("User is in the requests array for chitId:", chitId);
      console.log(request);
      res.json({ request: true, data: request });
    } else {
      console.log("User is not in the requests array for chitId:", chitId);
      res.json({ request: false, data: [] });
    }
  } catch (error) {
    console.error("Error:", error);
    res.send(error);
  }
};

// const SubmitRequest = async (req, res) => {
//   console.log(req.body, "llllllllllllllllllllllll");
//   try {
//     const userId = req.user.id;
//     const chitId = req.body.id;
//     let requestToJoin = await Request.findOne({ chitId });

//     if (!requestToJoin) {
//       requestToJoin = new Request({
//         chitId,
//         requestedUsers: [userId],
//       });
//       await requestToJoin.save();
//       res.json({ success: true });
//     } else {
//       requestToJoin.requestedUsers.push(userId);
//       await requestToJoin.save();
//       console.log("Request added to requestedUsers successfully");
//       res.json({ success: true });
//     }
//   } catch (error) {
//     console.error("Error creating request:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "An error occurred while saving the request",
//       });
//   }
// };

const SubmitRequest = async (req, res) => {
  console.log(req.body, "llllllllllllllllllllllll");
  try {
    const userId = req.user.id;
    const chitId = req.body.id;
    let requestToJoin = await Request.findOne({ chitId });

    if (!requestToJoin) {
      requestToJoin = new Request({
        chitId,
        requestedUsers: [{ user: userId, status: "pending" }],
      });
      await requestToJoin.save();
      res.json({ success: true });
    } else {
      const existingUserRequest = requestToJoin.requestedUsers.find((user) =>
        user.user.equals(userId)
      );
      if (existingUserRequest) {
        console.log("User already requested to join the chit.");
        res.json({
          success: false,
          message: "User already requested to join the chit.",
        });
      } else {
        requestToJoin.requestedUsers.push({ user: userId, status: "pending" });
        await requestToJoin.save();
        console.log("Request added to requestedUsers successfully");
        res.json({ success: true });
      }
    }
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while saving the request",
    });
  }
};

const getRequests = async (req, res) => {
  console.log("..........................................");
  const chitId = req.params.id;
  console.log(chitId);
  const requests = await Request.find({ chitId });
  if (requests.length === 0) {
    return res.json([]);
  }
  const requestedUsers = requests[0].requestedUsers;
  console.log(requestedUsers);
  res.json(requestedUsers);
};

const getUser = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  const user = await User.findById(_id);
  console.log(user);
  res.send(user);
};

const AcceptRequest = async (req, res) => {
  console.log(req.body, "ooooooooooooooooooooooooooo");
  const { id, chitId } = req.body;
  try {
    const request = await Request.findOne({ chitId });

    if (request) {
      // Update the document to remove the user from requestedUsers array
      await Request.updateOne(
        { chitId },
        { $pull: { requestedUsers: { user: id } } }
      );
    }
    let participants = await Participants.findOne({ chitId });

    if (participants) {
      participants.participants.push(id);
    } else {
      participants = new Participants({
        chitId,
        participants: [id],
      });
    }

    await participants.save();
    console.log(`User ${id} added to participants for chit ${chitId}`);
  } catch (error) {
    console.error("Error accepting participant:", error);
    throw error;
  }
};

const rejectRequest = async (req, res) => {
  console.log("haiiiiiiiiiiiiiiiiiiiiiiiiii");
  const { id, chitId } = req.body;
  console.log(chitId, id);
  try {
    const request = await Request.findOne({ chitId });
    console.log(".............", request);
    if (!request) {
      return res
        .status(404)
        .json({ message: "No requests found for the specified chit" });
    }
    // Find the requested user in the request
    const requestedUser = request.requestedUsers.find(
      (user) => user.user.toString() === id
    );

    // Update the status of the requested user to "rejected"
    requestedUser.status = "rejected";
    console.log(request);
    await request.save();
    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getParticipants = async (req, res) => {
  const chitId = req.params.id;
  console.log("ghai", chitId);
  try {
    const participants = await Participants.find({ chitId });
    console.log(participants[0]?.participants);
    const result = participants[0]?.participants;
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//remove user from chit
const removeUserFromParticipants = async (req, res) => {
  const { chitId, userId } = req.body;
  try {
    const chit = await Chitty.findById(chitId);
    if (!chit) {
      res.json({ dalete: false });
    }
    const currentDate = new Date();
    if (currentDate >= chit.startDate) {
      res.json({ dalete: false });
    }
    const result = await Participants.updateOne(
      { chitId },
      { $pull: { participants: userId } }
    );
    res.json({ dalete: true });
  } catch (error) {
    res.json({ dalete: false });
  }
};

const findUsersNotInParticipants = async (req, res) => {
  const chitId = req.params.id;
  try {
    const participants = await Participants.findOne({ chitId });

    if (!participants) {
      res.send([]);
    }
    const participantUserIds = participants.participants.map((participant) =>
      participant.toString()
    );
    console.log(participantUserIds, "jjjjjjjjjjjjjjj");
    const usersNotInParticipants = await User.find({
      _id: { $nin: participantUserIds },
      userType: { $ne: "admin" },
    });
    console.log(usersNotInParticipants);
    res.send(usersNotInParticipants);
  } catch (error) {
    res.send([]);
  }
};

// Function to send an invitation to a user
const sendInvitation = async (req, res) => {
  const { chitId, invitedUserId } = req.body;
  console.log(req.body, "kkkkkkkkkkkkkkkkkkkk");

  try {
    const existingInvitation = await Invitation.findOne({
      chitId,
      invitedUserId,
    });

    if (existingInvitation) {
      return res.json({ add: false, message: "Already Invited" });
    } else {
      const invitation = new Invitation({ chitId, invitedUserId });
      await invitation.save();
      return res
        .status(201)
        .json({ add: true, message: "Invitation sent successfully" });
    }
  } catch (error) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({ add: false, message: "Cant Add" });
  }
};

const getInvitationsForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const pendingInvitations = await Invitation.find({
      invitedUserId: userId,
      status: "pending",
    });

    res.status(200).json(pendingInvitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptInvitation = async (req, res) => {
  const invitationId = req.body.invitationId;
  console.log(req.body, "pppppppppppppppppppp");
  try {
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }
    console.log(invitation, "iiiiiiiiiiiiiiiiiiiiiiiiii");
    invitation.status = "accepted";
    await invitation.save();

    const chitId = invitation?.chitId;
    const userId = invitation?.invitedUserId;

    let participants = await Participants.findOne({ chitId });
    if (!participants) {
      participants = new Participants({ chitId, participants: [userId] });
      await participants.save();
    } else {
      participants.participants.push(userId);
      await participants.save();
    }

    res.status(200).json({ message: "Invitation accepted successfully" });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectInvitation = async (req, res) => {
  const { invitationId } = req.body;

  try {
    // Find the invitation by its ID
    const invitation = await Invitation.findById(invitationId);

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Update the status to "rejected"
    invitation.status = "rejected";
    await invitation.save();

    // Send a response indicating success
    res.json({ message: "Invitation rejected successfully" });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  console.log(req.file.location);
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;
    const profilePicture = req.file ? req.file.location : null;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userProfile = async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);
  res.send(user);
};

const getUserJoinedChits = async (req, res) => {
  const userId = req.user.id;
  try {
    const userParticipants = await Participants.find({
      participants: { $in: [userId] },
    });
    const joinedChits = [];

    for (let i = 0; i < userParticipants.length; i++) {
      const participant = userParticipants[i];
      const chit = await Chitty.findById(participant.chitId);
      if (chit) {
        joinedChits.push(chit);
      }
    }

    res.json(joinedChits);
  } catch (error) {
    console.error("Error fetching joined chits:", error);
    res.status(500).send([]);
  }
};

// Controller function to get the status of each month
getMonthlyStatus = async (req, res) => {
  try {
    const chitId = req.params.chitId;
    const userId = req.user.id;

    // Get the chit details including starting month and duration
    const chit = await Chitty.findById(chitId);
    if (!chit) {
      return res.status(404).json({ error: "Chit not found" });
    }

    // Generate a list of months from starting month to chit end
    const startingMonthParts = chit.StartingMonth.split("-");
    const startingMonth = parseInt(startingMonthParts[1]);
    const endingMonth = startingMonth + chit.duration - 1;
    const monthsList = [];
    for (let month = startingMonth; month <= endingMonth; month++) {
      monthsList.push(month.toString());
    }
    console.log(monthsList);
    // Get the payments for the chit
    const payments = await Payment.find({ chitId, userId });
    console.log("payments", payments);
    // Prepare the response with status of each month
    // Prepare the response with status of each month
    const monthlyStatus = monthsList.map((month) => {
      const monthNumber = parseInt(month);
      console.log("month", monthNumber);
      const monthName = new Date(
        Date.UTC(2000, monthNumber - 1, 1)
      ).toLocaleString("en", { month: "long" });
      const isPaid = payments.some((payment) => payment.month === monthName);
      return { month: monthName, isPaid };
    });

    console.log(monthlyStatus);
    res.status(200).json(monthlyStatus);
  } catch (error) {
    console.error("Error fetching monthly status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching monthly status" });
  }
};

const onSuccessPayment = async (req, res) => {
  const userId = req.user.id;
  const { chitId, month, amount } = req.body;
  const payed = new Payment({
    userId,
    chitId,
    amount,
    month,
    date: new Date(),
  });
  payed.save();
  console.log("saved");
};

const getUsersWhoPaid = async (req, res) => {
  const chitId = req.params.chitId;
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  Payment.find({ chitId, month: currentMonth })
  .distinct('userId') // Extract unique user IDs
  .then(async (userIds) => {
    // Query the User collection to get user details based on user IDs
    const users = await User.find({ _id: { $in: userIds } }, { _id: 1, firstName: 1, lastName: 1 });
    console.log('Users with chitId', chitId, 'and month', currentMonth + ':', users);
    res.send(users)
  })
  .catch((error) => {
    console.error('Error fetching users:', error);
    res.send([])
  });
};

const getWinners=async(req,res)=>{

  const chitId=req.params.chitid
  const winners = await Winner.find({ chitId });

// Extract userIds from winners
const winnerUserIds = winners.map(winner => winner.userId);

// Fetch user details for each userId
const users = await User.find({ _id: { $in: winnerUserIds } });

// Prepare response data
const responseData = winners.map(winner => {
    // Find the corresponding user details
    const correspondingUser = users.find(user => user._id.equals(winner.userId));
    if (correspondingUser) {
        return {
            userId: winner.userId,
            firstName: correspondingUser.firstName,
            lastName: correspondingUser.lastName,
            email: correspondingUser.email,
            month: winner.month
        };
    } else {
        console.error(`User not found for winner with ID: ${winner._id}`);
        return null;
    }
});

// Remove any null values from the response data
const filteredResponseData = responseData.filter(data => data !== null);
console.log(filteredResponseData);
// Send the response data
res.json(filteredResponseData);

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
  getUser,
  AcceptRequest,
  rejectRequest,
  getParticipants,
  removeUserFromParticipants,
  findUsersNotInParticipants,
  sendInvitation,
  getInvitationsForUser,
  acceptInvitation,
  rejectInvitation,
  updateProfile,
  userProfile,
  getUserJoinedChits,
  getMonthlyStatus,
  onSuccessPayment,
  getUsersWhoPaid,
  getWinners
};
