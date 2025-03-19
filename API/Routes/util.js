const express = require("express");
const router = express.Router();
const cloudinary = require("../Utils/cloudinaryConfig");

router.route("/get-signature").get((req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );
  res.status(200).json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

module.exports = router;
