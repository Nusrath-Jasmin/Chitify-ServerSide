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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }]
});

const RequestTojoin = mongoose.model('requesrToJoin',RequestJoinSchema);

module.exports = RequestTojoin;
