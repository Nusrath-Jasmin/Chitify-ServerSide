const mongoose = require("mongoose");
const User = require("./userModel");
const Chit = require("./ChitModel");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chitId: { type: mongoose.Schema.Types.ObjectId, ref: "Chit", required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  date: { type: String, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
