const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk User ID
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["admin", "validator", "creator", "donor"],
    default: "donor",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
