const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
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
  }
});

const Owner = mongoose.model('chitowner', ownerSchema);

module.exports = Owner;
