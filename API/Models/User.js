const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Store Clerk user ID
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: {
      type: String,
      enum: ["donor", "campaign_creator", "admin", "validator"],
      default: "donor",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
