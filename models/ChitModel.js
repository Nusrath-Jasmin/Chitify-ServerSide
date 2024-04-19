const mongoose = require("mongoose");

const chittySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  chitName: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  monthlyPayment: {
    type: Number,
    required: true,
  },
  participants: {
    type: Number,
    required: true,
  },
  chitType: {
    type: String,
    enum: ["public", "private"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  lotDate:{
    type:Number,
    required:true
  },
  StartingMonth:{
    type:String,
    required:true
  }
});

const Chitty = mongoose.model("chitty", chittySchema);

module.exports = Chitty;
