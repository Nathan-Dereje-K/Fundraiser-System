const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

// Unified storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Extract file extension from original name
    const fileExt = file.originalname.split(".").pop().toLowerCase();

    // Determine file type using extension
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
    ].includes(fileExt);
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
    ].includes(fileExt);
    const isDocument = [
      "pdf",
      "doc",
      "docx",
      "txt",
      "odt",
      "rtf",
      "xlsx",
      "pptx",
    ].includes(fileExt);

    return {
      folder: "uploads",
      resource_type: isVideo ? "video" : isDocument ? "auto" : "image",
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
        ? ["pdf", "doc", "docx", "txt", "odt", "rtf", "xlsx", "pptx"]
        : ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"],
    };
  },
});

// Unified multer instance
const upload = multer({ storage });

module.exports = { upload };
