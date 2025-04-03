const asyncHandler = require("../Middleware/async");
const { google } = require("googleapis");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../Utils/cloudinaryConfig");
const { signToken, verifyToken } = require("../Utils/jwt");
const { sendEmail } = require("../Utils/mailer");
const getOAuthClient = require("../Utils/getOAuthClient");
const getRandomColor = () => {
  const colors = ["FF5733", "33FF57", "3357FF", "FF33A8", "FFC300", "8E44AD"]; // Example colors
  return colors[Math.floor(Math.random() * colors.length)];
};

const oAuth2Client = getOAuthClient();

exports.getGoogleAuth = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Code is required" });

  const { tokens } = await oAuth2Client.getToken(code);

  oAuth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
  const { data } = await oauth2.userinfo.get();
  let user = await User.findOne({ email: data.email });

  if (!user) {
    const result = await cloudinary.uploader.upload(data.picture, {
      resource_type: "image",
    });

    user = new User({
      email: data.email,
      name: data.name,
      avatar: result.secure_url,
      provider: "google",
      verified: true,
    });
    await user.save();
  }

  const accessToken = signToken(user);
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res
    .cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    })
    .json({ message: "Logged in" });
});

//sign up with email and password
exports.signup = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  let user = await User.findOne({
    email,
  });
  if (user) {
    return res.status(400).json({
      error: "Email is taken",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const name = `${firstName} ${lastName}`;
  const background = getRandomColor();
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=${background}&length=1&font-size=0.6&bold=true&rounded=true`;

  user = new User({
    email,
    password: hashedPassword,
    name,
    provider: "email",
    avatar,
  });
  await user.save();
  const accessToken = signToken(user);
  res
    .cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    })
    .json({ message: "Logged in" });
});
// 🟢 Login with Email/Password
exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (
    !user ||
    !user.password ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = signToken(user);

  res
    .cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" })
    .json({ message: "Logged in" });
});

exports.getMe = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    const accessToken = signToken({ _id: "_", role: "guest" });
    res
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      })
      .json({ loggedIn: true, user: { userId: "_", role: "guest" } });
  } else {
    try {
      const decoded = verifyToken(token);
      res.json({ loggedIn: true, user: decoded });
    } catch {
      res.status(401).json({ loggedIn: false });
    }
  }
});
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  const hashedToken = await user.generateToken("RESET");
  await user.save();

  const mailResponse = await sendEmail({
    email,
    emailType: "RESET",
    hashedToken,
  });
  if (mailResponse.error)
    return res.status(500).json({ error: "Error sending email" });

  res.json({ message: "Email sent" });
});
exports.verifyForgotPasswordToken = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  const user = await User.findOne({
    forgotPasswordToken: token,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }
  user.password = await bcrypt.hash(password, 10);
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;
  await user.save();
  res.json({ message: "Password reset successfully" });
});
//send verify email token by extracting id from cokies and get email from user
exports.verifyEmail = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  const { email } = req.body;
  if (!token) return res.status(401).json({ loggedIn: false });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ loggedIn: false });
  const hashedToken = await user.generateToken("VERIFY");
  await user.save();
  const mailResponse = await sendEmail({
    email: user.email,
    emailType: "VERIFY",
    hashedToken,
  });
  if (mailResponse.error) {
    return res.status(500).json({ error: "Error sending email" });
  }
  res.json({ message: "Email sent" });
});
//verify email token by extracting id from cokies and get email from user
exports.verifyEmailToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ error: "Invalid token" });
  }
  user.verified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  await user.save();
  res.json({ message: "Email verified successfully" });
});
//logout by clearing the token
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});
//change password
exports.changePassword = asyncHandler(async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ loggedIn: false });

  if (
    user.provider === "email" &&
    (!user.password || !(await bcrypt.compare(currentPassword, user.password)))
  ) {
    return res.status(400).json({ message: "Invalid Current Password" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.json({ message: "Password changed" });
});
