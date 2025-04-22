// notificationRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../Controllers/NotificationCtrl");
const authMiddleware = require("../Middleware/authMiddleware");

// Apply auth middleware to all routes (redundant if already checking tokens in controller)
router.use(authMiddleware); 

// Public docs would show these require authentication
router.get("/user/:userId", controller.getUserNotifications);
router.get("/unread-count", controller.getUnreadCount);
router.patch("/:id/read", controller.markAsRead);
router.delete("/:id", controller.deleteNotification);

// Internal use only (protected via API key or admin auth)
router.post("/", controller.createNotification); 

module.exports = router;