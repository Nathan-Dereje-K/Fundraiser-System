const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    category: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    validator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    campaignManager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],

    image: [{ type: String }],
    video: [{ type: String }],
    link: [{ type: String }],

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
