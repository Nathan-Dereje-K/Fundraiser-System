/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
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
    setError,
    clearErrors,
  } = useForm();
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (step < 4) return;

    // Manual validation for files
    if (imageFiles.length === 0) {
      setError("files", {
        type: "manual",
        message: "At least one image is required",
      });
      return;
    }
    clearErrors("files");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("goalAmount", data.goalAmount);
    formData.append("category", data.category);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);

    imageFiles.forEach((file) => formData.append("image", file));
    if (videoFile) formData.append("video", videoFile);
    documentFiles.forEach((file) => formData.append("document", file));

    try {
      await axios.post("http://localhost:5000/api/campaigns", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Campaign created successfully!");
      navigate("/campaign_panel");
    } catch (error) {
      alert("Failed to create campaign. " + error.message);
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
      default:
        isValid = true;
    }
    if (isValid) setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleImageChange = (acceptedFiles) => {
    setImageFiles(acceptedFiles);
    if (acceptedFiles.length > 0) clearErrors("files");
  };

  const handleVideoChange = (acceptedFiles) => setVideoFile(acceptedFiles[0]);
  const handleDocumentChange = (acceptedFiles) =>
    setDocumentFiles(acceptedFiles);

  const FilePreview = ({ files }) => (
    <div className="mt-2">
      {files.map((file, index) => (
        <p key={index} className="text-gray-600 text-sm">
          {file.name}
        </p>
      ))}
    </div>
  );

  const DropzoneWrapper = ({ onDrop, multiple, label, error, name }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => {
        onDrop(acceptedFiles);
        if (name === "images" && acceptedFiles.length > 0) clearErrors("files");
      },
      multiple,
    });

    return (
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <div
          {...getRootProps()}
          className={`w-full p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer text-center ${
            error ? "border-red-500" : "border-gray-300 hover:border-cyan-400"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">
            Drag and drop files here, or click to select
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {multiple ? "Multiple files allowed" : "Single file only"}
          </p>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
                      {...register("title", { required: "Title is required" })}
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
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Environment">Environment</option>
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
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:border-transparent`}
                      {...register("startDate", {
                        required: "Start date is required",
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
                    onDrop={handleImageChange}
                    multiple
                    label="Campaign Images (Multiple allowed)"
                    error={errors.files?.message}
                    name="images"
                  />
                  <FilePreview files={imageFiles} />
                  <DropzoneWrapper
                    onDrop={handleVideoChange}
                    multiple={false}
                    label="Promotional Video (Optional)"
                  />
                  {videoFile && <FilePreview files={[videoFile]} />}
                  <DropzoneWrapper
                    onDrop={handleDocumentChange}
                    multiple
                    label="Supporting Documents (Multiple allowed)"
                  />
                  <FilePreview files={documentFiles} />
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
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating Campaign..." : "Submit Campaign"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreation;
