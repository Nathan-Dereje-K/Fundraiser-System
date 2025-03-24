const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

// Unified storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileType = file.mimetype.split("/")[1];

    // Determine file type: image, video, or document
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
    ].includes(fileType);
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
    ].includes(fileType);
    const isDocument = [
      "pdf",
      "doc",
      "docx",
      "txt",
      "odt",
      "rtf",
      "xlsx",
      "pptx",
    ].includes(fileType); // <-- New line

    // Set Cloudinary folder and resource type
    return {
      folder: "uploads",
      resource_type: isVideo ? "video" : isDocument ? "raw" : "image", // <-- Updated line
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
        : isDocument
        ? ["pdf", "doc", "docx", "txt", "odt", "rtf", "xlsx", "pptx"] // <-- New line
        : ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"],
    };
  },
});

// Unified multer instance
const upload = multer({ storage });

module.exports = { upload };
