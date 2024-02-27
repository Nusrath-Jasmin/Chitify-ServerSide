const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  accepted:{
    type:Boolean,
    default:false
  },
});

const Requst = mongoose.model('requestforadmin', requestSchema);

module.exports = Requst;
