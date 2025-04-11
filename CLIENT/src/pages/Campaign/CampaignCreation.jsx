/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import Step4Content from "./Step4Content";

const CampaignCreation = () => {
  const form = useForm();
  const { register, handleSubmit, formState, trigger, getValues } = form;
  const { errors } = formState;
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [links, setLinks] = useState([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  function isValidLink(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("goalAmount", data.goalAmount);
    formData.append("category", data.category);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);

    imageFiles.forEach((file) => formData.append("image", file));
    videoFiles.forEach((file) => formData.append("video", file));
    documentFiles.forEach((file) => formData.append("document", file));
    const validLinks = links.filter((link) => {
      return link && isValidLink(link);
    });
    validLinks.forEach((link) => {
      formData.append("link", link);
    });

    try {
      await axios.post("http://localhost:5000/api/campaigns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/campaign_panel");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      alert(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep = async () => {
    const fieldMap = {
      1: ["title", "description"],
      2: ["goalAmount", "category"],
      3: ["startDate", "endDate"],
      4: [],
    };
    return await trigger(fieldMap[step]);
  };

  const handleStepNavigation = async (direction) => {
    const isValid = await validateStep();
    if (!isValid) return;

    if (direction === "next" && step < 4) setStep((prev) => prev + 1);
    if (direction === "previous" && step > 1) setStep((prev) => prev - 1);
  };

  const handleNext = () => handleStepNavigation("next");
  const handlePrevious = () => handleStepNavigation("previous");

  const Step1Content = () => (
    <>
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Campaign Title
        </label>
        <input
          placeholder="Enter a compelling campaign title"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          {...register("title", {
            required: "Title is required",
            maxLength: { value: 100, message: "Max 100 characters" },
          })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <textarea
          placeholder="Describe your campaign's purpose..."
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
    </>
  );

  const Step2Content = () => (
    <>
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Goal Amount ($)
        </label>
        <input
          placeholder="Ex: 10,000$"
          type="number"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.goalAmount ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          {...register("goalAmount", {
            required: "Goal amount is required",
            min: { value: 1, message: "Must be positive" },
          })}
        />
        {errors.goalAmount && (
          <p className="text-red-500 text-sm mt-1">
            {errors.goalAmount.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Category</label>
        <select
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.category ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          {...register("category", { required: "Category is required" })}
        >
          <option value="">Select a category</option>
          {["Education", "Medical", "Individual", "Religious", "Other"].map(
            (opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            )
          )}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>
    </>
  );

  const Step3Content = () => {
    const dateValidation = {
      startDate: {
        required: "Start date is required",
        validate: (value) =>
          new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0)) ||
          "Cannot be in the past",
      },
      endDate: {
        required: "End date is required",
        validate: (value) =>
          new Date(value) > new Date(getValues("startDate")) ||
          "Must be after start date",
      },
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["startDate", "endDate"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium mb-2">
              {field === "startDate" ? "Start Date" : "End Date"}
            </label>
            <input
              type="date"
              min={
                field === "startDate"
                  ? new Date().toISOString().split("T")[0]
                  : undefined
              }
              className={`w-full px-4 py-3 rounded-lg border ${
                errors[field] ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              {...register(field, dateValidation[field])}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field].message}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center space-y-4">
              <Loader size={96} color="text-blue-500" />
              <motion.p className="text-lg font-medium text-gray-700">
                Creating Your Campaign...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Create a New Campaign
          </h1>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= num
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {num}
                  </div>
                  {num < 4 && (
                    <div
                      className={`w-16 h-1 ${
                        step > num ? "bg-orange-500" : "bg-gray-200"
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
              {step === 1 && <Step1Content />}
              {step === 2 && <Step2Content />}
              {step === 3 && <Step3Content />}
              {step === 4 && (
                <Step4Content
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                  videoFiles={videoFiles}
                  setVideoFiles={setVideoFiles}
                  documentFiles={documentFiles}
                  setDocumentFiles={setDocumentFiles}
                  links={links}
                  setLinks={setLinks}
                />
              )}
            </motion.div>
            <div className="flex justify-between mt-8">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
                  >
                    Previous
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={
                  step === 4 ? handleSubmit(handleFormSubmit) : handleNext
                }
                disabled={isLoading}
                className={`px-6 py-2.5 text-white rounded-lg focus:ring-2 ${
                  step === 4
                    ? "bg-green-500 hover:bg-green-600 focus:ring-green-400"
                    : "bg-orange-500 hover:bg-orange-600 focus:ring-orange-400"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading
                  ? "Processing..."
                  : step === 4
                  ? "Submit Campaign"
                  : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreation;
