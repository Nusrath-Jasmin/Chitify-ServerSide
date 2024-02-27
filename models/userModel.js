const mongoose = require("mongoose");

// schema model for user 
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneVerified:{
    type:Boolean,
    required:true
  },
  emailVerified:{
    type:Boolean,
    required:true,
    default:false
  },
  userType: {
    type: String,
    default: "user",
  },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
