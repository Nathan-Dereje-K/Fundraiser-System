const express = require("express");
const Notification = require("../Models/Notification");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

// Get all notifications (with pagination example)
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("campaignId", "title")
      .skip(req.query.skip || 0)
      .limit(req.query.limit || 20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark as read (with validation)
router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.user._id // Ensures ownership
      },
      { read: true },
      { new: true }
    ).populate("campaignId", "title");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete (with existence check)
router.delete("/:id", async (req, res) => {
  try {
    const { deletedCount } = await Notification.deleteOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.sendStatus(204); // No content
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;