const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requiredq: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["donation", "withdrawal"],
    default: "donation",
  },
  method: {
    type: String,
    enum: ["local", "international"],
    default: "local",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);

// if (transactionType === "donation") {
//     campaign.raisedAmount += amount;
// }

// if (transactionType === "withdrawal") {
//     campaign.raisedAmount -= amount;
// }
