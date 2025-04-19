const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  provider: { type: String, enum: ["google", "email"], required: true },
  verified: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user", "admin", "validator", "manager"],
    default: "user",
  },
  bio: String,
  createdAt: { type: Date, default: Date.now },
  avatar: String,
  verifyToken: String,
  verifyTokenExpiry: Date,
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
});

userSchema.methods.generateToken = async function (emailType) {
  const token = await bcryptjs.hash(this._id.toString(), 10);
  if (emailType === "VERIFY") {
    this.verifyToken = token;
    this.verifyTokenExpiry = Date.now() + 3600000; // 1 hour
  } else if (emailType === "RESET") {
    this.forgotPasswordToken = token;
    this.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
  }
  return token;
};

module.exports = mongoose.model("User", userSchema);
