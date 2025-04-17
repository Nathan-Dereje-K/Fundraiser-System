/* eslint-disable react/prop-types */
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";

const FilePreview = ({ files, onRemove }) => (
  <div className="mt-2">
    {files.map((file, index) => (
      <div key={index} className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">{file.name}</p>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    ))}
  </div>
);

const Dropzone = ({ onDrop, multiple, label, accept }) => {
  const dropzone = useDropzone({ onDrop, multiple, accept });

  return (
    <div className="mt-6">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div
        {...dropzone.getRootProps()}
        className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg transition-colors cursor-pointer text-center hover:border-orange-400"
      >
        <input {...dropzone.getInputProps()} />
        <p className="text-gray-600">
          Drag and drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {multiple ? "Multiple files allowed" : "Single file only"}
        </p>
      </div>
    </div>
  );
};
const Step4Content = ({
  imageFiles,
  setImageFiles,
  videoFiles,
  setVideoFiles,
  documentFiles,
  setDocumentFiles,
  links,
  setLinks,
}) => {
  const handleDocumentDrop = (acceptedFiles) => {
    const validExtensions = [".pdf", ".doc", ".docx"];
    const validFiles = [];

    acceptedFiles.forEach((file) => {
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (validExtensions.includes(ext)) {
        validFiles.push(file);
      }
    });

    setDocumentFiles((prev) => [...prev, ...validFiles]);
  };
  const handleImageDrop = (acceptedFiles) => {
    const validFiles = [];
    acceptedFiles.forEach((file) => {
      if (file.type.split("/")[0] === "image") {
        validFiles.push(file);
      }
    });
    setImageFiles((prev) => [...prev, ...validFiles]);
  };
  const handleVideoDrop = (acceptedFiles) => {
    const validFiles = [];
    acceptedFiles.forEach((file) => {
      if (file.type.split("/")[0] === "video") {
        validFiles.push(file);
      }
    });
    setVideoFiles((prev) => [...prev, ...validFiles]);
  };
  // Link management functions
  const addLink = (e) => {
    e.preventDefault();
    setLinks((prev) => [...prev, ""]);
  };

  const removeLink = (index, e) => {
    e.preventDefault();
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLink = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  return (
    <>
      <Dropzone
        onDrop={handleImageDrop}
        multiple={true}
        label="Campaign Images (Multiple allowed)"
        accept="image/*"
      />
      <FilePreview
        files={imageFiles}
        onRemove={(index) =>
          setImageFiles((prev) => prev.filter((_, i) => i !== index))
        }
      />

      <Dropzone
        onDrop={handleVideoDrop}
        multiple={true}
        label="Promotional Videos (Optional)"
        accept="video/*"
      />
      <FilePreview
        files={videoFiles}
        onRemove={(index) =>
          setVideoFiles((prev) => prev.filter((_, i) => i !== index))
        }
      />

      <Dropzone
        onDrop={handleDocumentDrop}
        multiple={true}
        label="Supporting Documents (Multiple allowed)"
        accept=".pdf,.doc,.docx"
      />
      <FilePreview
        files={documentFiles}
        onRemove={(index) =>
          setDocumentFiles((prev) => prev.filter((_, i) => i !== index))
        }
      />

      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">
          Related Links
        </label>
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="url"
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
              placeholder="https://example.com"
            />
            <button
              type="button"
              onClick={(e) => removeLink(index, e)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Add Link
        </button>
      </div>
    </>
  );
};

export default Step4Content;
