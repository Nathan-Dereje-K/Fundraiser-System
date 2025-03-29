/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const CampaignCreation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm();
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [links, setLinks] = useState([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    // Append basic fields
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    });

    // Append files and links
    imageFiles.forEach((file) => formData.append("image", file));
    videoFiles.forEach((file) => formData.append("video", file));
    documentFiles.forEach((file) => formData.append("document", file));
    links.forEach((link) => formData.append("link", link));

    try {
      await axios.post("http://localhost:5000/api/campaigns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/campaign_panel");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;
    switch (step) {
      case 1:
        isValid = await trigger(["title", "description"]);
        break;
      case 2:
        isValid = await trigger(["goalAmount", "category"]);
        break;
      case 3:
        isValid = await trigger(["startDate", "endDate"]);
        break;
      case 4:
        // Final validation before submission
        isValid = true;
        break;
      default:
        isValid = false;
    }

    if (isValid && step < 4) {
      setStep((prev) => prev + 1);
    } else if (step === 4) {
      handleSubmit(onSubmit)();
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // Link management functions
  const addLink = () => setLinks([...links, ""]);
  const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));
  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const FilePreview = ({ files }) => (
    <div className="mt-2">
      {files.map((file, index) => (
        <p key={index} className="text-gray-600 text-sm">
          {file.name}
        </p>
      ))}
    </div>
  );

  const DropzoneWrapper = ({ onDrop, multiple, label, accept }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      multiple,
      accept,
    });

    return (
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <div
          {...getRootProps()}
          className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg transition-colors cursor-pointer text-center hover:border-cyan-400"
        >
          <input {...getInputProps()} />
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Create a New Campaign
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= num
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {num}
                  </div>
                  {num < 4 && (
                    <div
                      className={`w-16 h-1 ${
                        step > num ? "bg-cyan-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Campaign Title
                    </label>
                    <input
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      {...register("title", {
                        required: "Title is required",
                        maxLength: {
                          value: 100,
                          message: "Title cannot exceed 100 characters",
                        },
                      })}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      {...register("description", {
                        required: "Description is required",
                      })}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Goal Amount ($)
                    </label>
                    <input
                      type="number"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.goalAmount ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      {...register("goalAmount", {
                        required: "Goal amount is required",
                        min: { value: 1, message: "Amount must be positive" },
                      })}
                    />
                    {errors.goalAmount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.goalAmount.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Category
                    </label>
                    <select
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      {...register("category", {
                        required: "Category is required",
                      })}
                    >
                      <option value="">Select a category</option>
                      <option value="Education">Education</option>
                      <option value="Medical">Medical</option>
                      <option value="Individual">Individual</option>
                      <option value="Religious">Religious</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      {...register("startDate", {
                        required: "Start date is required",
                        validate: (value) =>
                          new Date(value) >= new Date() || "Cannot be in past",
                      })}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.endDate ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      {...register("endDate", {
                        required: "End date is required",
                        validate: (value) => {
                          const start = new Date(getValues("startDate"));
                          const end = new Date(value);
                          return end > start || "Must be after start date";
                        },
                      })}
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <>
                  <DropzoneWrapper
                    onDrop={setImageFiles}
                    multiple={true}
                    label="Campaign Images (Multiple allowed)"
                    accept="image/*"
                  />
                  <FilePreview files={imageFiles} />

                  <DropzoneWrapper
                    onDrop={setVideoFiles}
                    multiple={true}
                    label="Promotional Videos (Optional)"
                    accept="video/*"
                  />
                  <FilePreview files={videoFiles} />

                  <DropzoneWrapper
                    onDrop={setDocumentFiles}
                    multiple={true}
                    label="Supporting Documents (Multiple allowed)"
                    accept=".pdf,.doc,.docx"
                  />
                  <FilePreview files={documentFiles} />

                  <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Related Links
                    </label>
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) =>
                            handleLinkChange(index, e.target.value)
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-300"
                          placeholder="https://example.com"
                        />
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLink}
                      className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                    >
                      Add Link
                    </button>
                  </div>
                </>
              )}
            </motion.div>

            <div className="flex justify-between mt-8">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className={`px-6 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    step === 4
                      ? "bg-green-500 hover:bg-green-600 focus:ring-green-400"
                      : "bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-400"
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isLoading
                    ? "Processing..."
                    : step === 4
                    ? "Submit Campaign"
                    : "Next"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreation;
