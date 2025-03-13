const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const User = require("../Models/User");

// Middleware to check if user has the required role
const requireRole = (role) => async (req, res, next) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user || user.role !== role) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const requireAuth = ClerkExpressRequireAuth();

module.exports = { requireAuth, requireRole };
