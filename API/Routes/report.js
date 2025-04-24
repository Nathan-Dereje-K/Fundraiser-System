const express = require("express");
const router = express.Router();
const {
  createReport,
  getReportsByUserId,
  getAllReports,
} = require("../Controllers/report"); // Your controller function
const { upload } = require("../Config/multerConfig"); // Your multer setup
const authMiddleware = require("../Middleware/authMiddleware"); // Your auth middleware

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createReport
);
router.route("/").get(authMiddleware, getAllReports);
router.route("/:id").get(authMiddleware, getReportsByUserId);

module.exports = router;
