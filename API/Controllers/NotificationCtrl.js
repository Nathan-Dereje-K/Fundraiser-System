const asyncHandler = require("../Middleware/async");
const Notification = require("../Models/Notification");
const { getUserFromToken } = require("../Utils/jwt");
const mongoose = require("mongoose");

// @desc    Get all notifications for a user
// @route   GET /api/notifications/user/:userId
// @access  Private
exports.getUserNotifications = asyncHandler(async (req, res) => {
  // 1. Token validation (same as donation controller)
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ 
      status: "error",
      loggedIn: false,
      message: "No authentication token provided" 
    });
  }

  // 2. Get user from token
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).json({ 
      status: "error",
      loggedIn: false,
      message: "Invalid or expired token" 
    });
  }

  // 3. Authorization check (user can only access their own notifications)
  if (req.params.userId !== user._id.toString()) {
    return res.status(403).json({ 
      status: "error",
      message: "Unauthorized access to notifications" 
    });
  }

  // 4. Fetch notifications
  const notifications = await Notification.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .populate("campaignId", "title");

  res.status(200).json({
    status: "success",
    data: {
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    }
  });
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });

  const user = await getUserFromToken(token);
  if (!user) return res.status(401).json({ loggedIn: false });

  const count = await Notification.countDocuments({
    userId: user._id,
    read: false
  });

  res.status(200).json({ 
    status: "success", 
    data: { count } 
  });
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });

  const user = await getUserFromToken(token);
  if (!user) return res.status(401).json({ loggedIn: false });

  const notification = await Notification.findOneAndUpdate(
    { 
      _id: req.params.id, 
      userId: user._id // Ensures user owns the notification
    },
    { $set: { read: true } },
    { new: true }
  ).populate("campaignId", "title");

  if (!notification) {
    return res.status(404).json({
      status: "error",
      message: "Notification not found or access denied"
    });
  }

  res.status(200).json({
    status: "success",
    data: { notification }
  });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });

  const user = await getUserFromToken(token);
  if (!user) return res.status(401).json({ loggedIn: false });

  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: user._id // Security: User can only delete their own notifications
  });

  if (!notification) {
    return res.status(404).json({
      status: "error",
      message: "Notification not found or access denied"
    });
  }

  res.status(200).json({
    status: "success",
    message: "Notification deleted successfully"
  });
});

// @desc    Create a notification (typically called internally by other services)
// @route   POST /api/notifications
// @access  Private (Admin/System)
exports.createNotification = asyncHandler(async (req, res) => {
  // This endpoint would likely use a different auth method (e.g., API key for internal use)
  const { userId, message, type, campaignId, link } = req.body;

  const notification = await Notification.create({
    userId: userId || new mongoose.Types.ObjectId("000000000000000000000000"),
    message,
    type,
    campaignId,
    link,
    read: false
  });

  res.status(201).json({
    status: "success",
    data: { notification }
  });
});