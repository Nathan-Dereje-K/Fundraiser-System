const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

// Unified storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "svg",
      "tiff",
      "ico",
    ].includes(file.mimetype.split("/")[1]);
    const isVideo = [
      "mp4",
      "avi",
      "mov",
      "wmv",
      "flv",
      "webm",
      "mkv",
      "3gp",
      "mpeg",
      "mpg",
    ].includes(file.mimetype.split("/")[1]);

    return {
      folder: "uploads",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo
        ? [
            "mp4",
            "avi",
            "mov",
            "wmv",
            "flv",
            "webm",
            "mkv",
            "3gp",
            "mpeg",
            "mpg",
          ]
        : ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"],
    };
  },
});

// Unified multer instance
const upload = multer({ storage });

module.exports = { upload };
