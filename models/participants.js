const mongoose = require('mongoose');
const Chit=require('./ChitModel')
const User=require('./userModel')

const ParticipantsSchema = new mongoose.Schema({
  chitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chit', 
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }]
});

const Participants = mongoose.model('Participants', ParticipantsSchema);

module.exports = Participants;
