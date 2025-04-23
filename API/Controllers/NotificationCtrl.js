const asyncHandler = require("../Middleware/async");
const Notification = require("../Models/Notification");
const mongoose = require("mongoose");

// @desc    Get all notifications for a user
// @route   GET /api/notifications/user/:userId
// @access  Private
exports.getUserNotifications = asyncHandler(async (req, res) => {
  // Authorization check (user can only access their own notifications)
  if (req.params.userId !== req.user.id) {
    return res.status(403).json({ 
      status: "error",
      message: "Unauthorized access to notifications" 
    });
  }

  // Fetch notifications
  const notifications = await Notification.find({ userId: req.user.id })
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
  const count = await Notification.countDocuments({
    userId: req.user.id,
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
  const notification = await Notification.findOneAndUpdate(
    { 
      _id: req.params.id, 
      userId: req.user.id // Ensures user owns the notification
    },
    { $set: { read: true } },
    { new: true }
  ).populate("campaignId", "title");

  if (!notification) {
    return res.status(404).json({
      status: "error",
      message: "Notification not found"
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
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!notification) {
    return res.status(404).json({
      status: "error",
      message: "Notification not found"
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