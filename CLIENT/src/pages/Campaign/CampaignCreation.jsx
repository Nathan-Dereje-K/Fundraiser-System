import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ChevronRight, ChevronLeft } from "lucide-react";

const steps = [
  "Campaign Info",
  "Funding & Media",
  "Documents & Details",
  "Review & Submit",
];

const CampaignCreation = () => {
  const [step, setStep] = useState(0);
  const { register, handleSubmit, watch, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data) => {
    setLoading(true);

    // Prepare form data to be sent to the backend
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("target", data.target);
    formData.append("duration", data.duration);

    // Add video file (this will be handled by your backend)
    if (data.video && data.video.length > 0) {
      formData.append("video", data.video[0]);
    }

    // Add image file
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    // Add document files (if any)
    if (data.documents && data.documents.length > 0) {
      Array.from(data.documents).forEach((file) => {
        formData.append("documents", file);
      });
    }

    try {
      // Send the form data to the backend
      const response = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Campaign submitted successfully!");
        reset(); // Reset form
        setStep(0); // Go back to the first step
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {steps[step]}
        </h2>

        {/* Progress Bar */}
        <div className="flex items-center mb-8">
          {steps.map((label, index) => (
            <div key={index} className="flex-1 flex items-center">
              <div
                className={`w-full h-2 rounded-full ${
                  index <= step ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
              {index < steps.length - 1 && <div className="w-2" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Campaign Info */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Name
                  </label>
                  <input
                    {...register("name")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter campaign name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option>Education</option>
                    <option>Medical</option>
                    <option>Individual</option>
                    <option>Religious</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows="4"
                    placeholder="Describe your campaign"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Funding & Media */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount ($)
                  </label>
                  <input
                    {...register("target")}
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter target amount"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Duration in days
                  </label>
                  <input
                    {...register("duration")}
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Eg. 120 Days"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Campaign Image
                  </label>
                  <input
                    type="file"
                    {...register("image")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    accept="image/*"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Video (Link or Upload)
                  </label>
                  <input
                    type="file"
                    {...register("video")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    accept="video/*"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Documents & Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Documents (PDF, Word, etc.)
                  </label>
                  <input
                    type="file"
                    {...register("documents")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Details
                  </label>
                  <textarea
                    {...register("details")}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows="4"
                    placeholder="Provide additional details about your campaign"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Review Your Campaign
                </h3>
                <p className="text-gray-700">
                  <strong>Name:</strong> {watch("name")}
                </p>
                <p className="text-gray-700">
                  <strong>Category:</strong> {watch("category")}
                </p>
                <p className="text-gray-700">
                  <strong>Description:</strong> {watch("description")}
                </p>
                <p className="text-gray-700">
                  <strong>Target Amount:</strong> ${watch("target")}
                </p>
                <p className="text-gray-700">
                  <strong>Duration:</strong> {watch("duration")} days
                </p>
                <p className="text-gray-700">
                  <strong>Video:</strong>{" "}
                  {watch("video") ? "Uploaded" : "Not uploaded"}
                </p>
                <p className="text-gray-700">
                  <strong>Additional Details:</strong> {watch("details")}
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                type="button"
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg flex items-center hover:bg-gray-400 transition-all"
                onClick={prevStep}
              >
                <ChevronLeft size={18} className="mr-2" />
                Back
              </button>
            )}
            <div>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg flex items-center hover:bg-orange-600 transition-all"
                  onClick={nextStep}
                >
                  Next
                  <ChevronRight size={18} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg flex items-center hover:bg-orange-600 transition-all"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CampaignCreation;
