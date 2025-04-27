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
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  usersName: { type: String, default: "Anonymous" },
  amount: {
    type: Number,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["donation", "withdrawal", "reallocation"],
    default: "donation",
  },
  accountNumber: { type: String, default: "" },
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
  meta: {
    suspendedCampaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    suspendedCampaignTitle: { type: String },
    targetCampaignTitle: { type: String },
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);

// if (transactionType === "donation") {
//     campaign.raisedAmount += amount;
// }

// if (transactionType === "withdrawal") {
//     campaign.raisedAmount -= amount;
// }
