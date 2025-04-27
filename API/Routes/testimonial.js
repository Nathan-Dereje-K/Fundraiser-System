const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial,
} = require("../Controllers/testimonial"); // Your controller function
const { upload } = require("../Config/multerConfig"); // Your multer setup
const authMiddleware = require("../Middleware/authMiddleware"); // Your auth middleware

router.post(
  "/",
  authMiddleware,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createTestimonial
);
router.route("/").get(authMiddleware, getAllTestimonials);
router.route("/:id").delete(deleteTestimonial); // Assuming you have a deleteReport function in your controller

module.exports = router;
