import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  FileText,
  Video as VideoIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Folder,
  Clock,
  DollarSign,
  Calendar,
  HeartPulse,
  BookOpen,
  Leaf,
  Laptop,
  AlertCircle,
} from "lucide-react";
import Loader from "../../components/ui/Loader";

const categoryIcons = {
  Medical: HeartPulse,
  Education: BookOpen,
  Environment: Leaf,
  Technology: Laptop,
  default: Folder,
};

// const sidebarVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: { opacity: 1, x: 0 },
//   exit: { opacity: 0, x: -20 },
// };

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ValidatorPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/campaigns", {
        params: { status: "pending" },
      });
      setCampaigns(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to load campaigns. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleStatusUpdate = async (id, status, reason = "") => {
    setActionLoading(true);
    try {
      const payload = { status };
      if (status === "rejected" && reason) {
        payload.rejectionReason = reason;
      }

      await axios.put(`http://localhost:5000/api/campaigns/${id}`, payload);
      await fetchCampaigns();
      setSelectedCampaign(null);
      alert(`Campaign ${status} successfully!`);
    } catch (err) {
      console.error("Status update error:", err.response?.data);
      alert(`Action failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    const IconComponent = categoryIcons[category] || categoryIcons.default;
    return <IconComponent className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50/20 flex">
      {/* Animated Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-80 bg-white shadow-2xl p-6 space-y-6 border-r border-gray-100"
      >
        <motion.div className="pb-4 border-b border-gray-100">
          <motion.h2
            initial="hidden"
            animate="visible"
            className="text-2xl font-bold text-gray-900 flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Folder className="w-8 h-8 text-blue-600" />
            </motion.div>
            Campaign Portal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-500 mt-2"
          >
            {campaigns.length} campaigns awaiting review
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div>
            <Loader
              size={80} // Control overall size
              color="text-blue-500" // Change main color
            />
          </div>
        ) : error ? (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-4 bg-red-50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        ) : campaigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-gray-50 rounded-xl text-center"
          >
            <Clock className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-2">No campaigns awaiting review</p>
          </motion.div>
        ) : (
          <LayoutGroup>
            <motion.div className="space-y-3">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign._id}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={cardVariants}
                  transition={{ delay: index * 0.05, type: "spring" }}
                  className={`group relative p-4 rounded-xl transition-all cursor-pointer ${
                    selectedCampaign?._id === campaign._id
                      ? "bg-blue-50 border-2 border-blue-200"
                      : "bg-white hover:bg-gray-50 border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex justify-between items-start"
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        animate={{
                          rotate:
                            selectedCampaign?._id === campaign._id ? 10 : 0,
                        }}
                        className="mt-1"
                      >
                        {getCategoryIcon(campaign.category)}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate pr-6">
                          {campaign.title}
                        </h3>
                        <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                          {campaign.category}
                        </span>
                      </div>
                    </div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-gray-400 shrink-0"
                    >
                      {formatDate(campaign.createdAt)}
                    </motion.span>
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="mt-3 flex items-center gap-2 text-sm text-gray-500"
                  >
                    {/* <DollarSign className="w-4 h-4" />
                    <span>Goal: ${campaign.goalAmount?.toLocaleString()}</span> */}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </LayoutGroup>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!selectedCampaign ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-6 bg-blue-50 rounded-full mb-6"
              >
                <FileText className="w-12 h-12 text-blue-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Select a Campaign
              </h3>
              <p className="text-gray-500">
                Choose a campaign from the sidebar to view detailed information
                and perform validation actions.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCampaign._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-100"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {selectedCampaign.title}
                  </motion.h1>
                  <div className="mt-2 flex items-center gap-3">
                    <motion.span
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        selectedCampaign.status
                      )}`}
                    >
                      {selectedCampaign.status.toUpperCase()}
                    </motion.span>
                    <span className="text-sm text-gray-500">
                      Created {formatDate(selectedCampaign.createdAt)}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setSelectedCampaign(null)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              {/* Campaign Details */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Campaign Overview
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {selectedCampaign.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-5 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Funding Goal
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          ${selectedCampaign.goalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-5 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Campaign Duration
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {formatDate(selectedCampaign.startDate)} -{" "}
                          {formatDate(selectedCampaign.endDate)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Media Sections */}
                {selectedCampaign.image?.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Campaign Images ({selectedCampaign.image.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedCampaign.image.map((img, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="relative group aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <img
                            src={img}
                            alt={`Campaign visual ${index + 1}`}
                            className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {selectedCampaign.video?.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <VideoIcon className="w-6 h-6 text-red-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Campaign Videos ({selectedCampaign.video.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedCampaign.video.map((video, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="relative bg-black rounded-xl overflow-hidden shadow-lg"
                        >
                          <video
                            controls
                            className="w-full aspect-video"
                            preload="metadata"
                          >
                            <source src={`${video}#t=0.5`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {(selectedCampaign.document?.length > 0 ||
                  selectedCampaign.link?.length > 0) && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Supporting Materials
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCampaign.document?.map((doc, index) => (
                        <motion.a
                          key={`doc-${index}`}
                          whileHover={{ y: -3 }}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-4"
                        >
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <FileText className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.split("/").pop()}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {doc}
                            </p>
                          </div>
                        </motion.a>
                      ))}

                      {selectedCampaign.link?.map((link, index) => (
                        <motion.a
                          key={`link-${index}`}
                          whileHover={{ y: -3 }}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-4"
                        >
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <LinkIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {new URL(link).hostname}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {link}
                            </p>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.section>
                )}
              </div>

              {/* Action Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-6 border-t border-gray-100"
              >
                <div className="flex flex-col-reverse md:flex-row justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    Campaign ID: {selectedCampaign._id}
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={async () => {
                        const reason = prompt(
                          "Please provide rejection reason:",
                          "Does not meet our community guidelines"
                        );
                        if (reason) {
                          await handleStatusUpdate(
                            selectedCampaign._id,
                            "rejected",
                            reason
                          );
                        }
                      }}
                      disabled={actionLoading}
                      className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      {actionLoading ? "Rejecting..." : "Reject Campaign"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleStatusUpdate(selectedCampaign._id, "approved")
                      }
                      disabled={actionLoading}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {actionLoading ? "Approving..." : "Approve Campaign"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ValidatorPage;
