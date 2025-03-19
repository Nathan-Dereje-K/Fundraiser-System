import React, { useState, useRef } from "react";
import { cn } from "../../lib/utils";
import { Camera } from "lucide-react";
import { getSignature } from "../../api/utilApi";
import axios from "axios";

const Avatar = ({
  src,
  alt,
  size = "md",
  className,
  editable = false,
  onImageChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png"];
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (
      file &&
      onImageChange &&
      ALLOWED_TYPES.includes(file.type) &&
      file.size <= MAX_FILE_SIZE
    ) {
      const data = await getSignature();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", data.timestamp);
      formData.append("signature", data.signature);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
          formData
        );
        onImageChange(res.data.secure_url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-200 cursor-pointer",
        {
          "h-8 w-8": size === "sm",
          "h-10 w-10": size === "md",
          "h-16 w-16": size === "lg",
          "h-24 w-24": size === "xl",
        },
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleImageClick}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(e) => {
          const target = e.target;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            const initials = alt
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();
            const textEl = document.createElement("div");
            textEl.className =
              "absolute inset-0 flex items-center justify-center text-gray-600 font-medium";
            textEl.textContent = initials.slice(0, 2);
            parent.appendChild(textEl);
          }
        }}
      />
      {editable && isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Camera className="h-6 w-6 text-white" />
        </div>
      )}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default Avatar;
