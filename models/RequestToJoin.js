const mongoose = require('mongoose');
const Chit=require('./ChitModel')
const User=require('./userModel')

const RequestJoinSchema = new mongoose.Schema({
  chitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chit', 
    required: true
  },
  requestedUsers: [{
    user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}]
});

const RequestTojoin = mongoose.model('requesrToJoin',RequestJoinSchema);

module.exports = RequestTojoin;
