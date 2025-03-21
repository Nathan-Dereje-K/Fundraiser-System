const express = require("express");
const { protect, authorize } = require("../Middleware/auth");
const User = require("../Models/User");
const router = express.Router();

// Admin gets all users
router.get("/users", protect, authorize("admin"), async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

// Admin updates a user's role
router.put("/users/:id", protect, authorize("admin"), async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  );
  res.status(200).json({ success: true, data: user });
});

// Admin deletes a user
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});

module.exports = router;
