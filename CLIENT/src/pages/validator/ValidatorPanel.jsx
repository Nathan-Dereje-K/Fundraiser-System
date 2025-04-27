import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Loader from "../../components/ui/Loader";
import { getPendingCampaigns } from "../../api/campaignApi";
import { useUpdateCampaign } from "../../hooks/useCampaign";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/layout/Navbar";
// import Navbar from "../../components/layout/Navbar";

const categoryIcons = {
  Medical: HeartPulse,
  Education: BookOpen,
  Environment: Leaf,
  Technology: Laptop,
  default: Folder,
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const sidebarVariants = {
  expanded: { width: 340 },
  collapsed: { width: 84 },
};

const ValidatorPage = () => {
  const queryClient = useQueryClient();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    window.innerWidth < 768
  );

  const {
    data: campaigns = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["campaigns", "pending"],
    queryFn: getPendingCampaigns,
  });

  const updateCampaignMutation = useUpdateCampaign();
  const { t } = useTranslation();

  const handleStatusUpdate = async (status, reason = "") => {
    if (!selectedCampaign) return;

    const payload = { id: selectedCampaign._id, status };
    if (status === "rejected" && reason) {
      payload.rejectionReason = reason;
    }

    try {
      await updateCampaignMutation.mutateAsync(payload);
      queryClient.invalidateQueries(["campaigns", "pending"]);
      setSelectedCampaign(null);
      toast.success(`Campaign ${status} successfully.`);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(`Action failed: ${error.message}`);
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
    return <IconComponent className="w-5 h-5 text-orange-600" />;
  };

  return (
    <div>
      <Navbar />
      <div className=" flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Sidebar */}
        <motion.aside
          initial="expanded"
          animate={isSidebarCollapsed ? "collapsed" : "expanded"}
          variants={sidebarVariants}
          className="bg-white shadow-2xl overflow-hidden relative border-r border-gray-100"
        >
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold pt-4 pb-4 text-2xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
                >
                  {t("Validator Portal")}
                </motion.h2>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </motion.button>
          </div>
          <nav className="p-4 max-h-[calc(100vh-64px)]">
            <LayoutGroup>
              <motion.div className="space-y-3">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader size={40} color="text-blue-500" />
                  </div>
                ) : error ? (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-red-50 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-red-600 text-sm">
                      {error.response?.data?.message || error.message}
                    </p>
                  </motion.div>
                ) : campaigns.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 bg-gray-50 rounded-xl text-center"
                  >
                    <Clock className="w-8 h-8 text-gray-400 mx-auto" />
                    {isSidebarCollapsed ? (
                      ""
                    ) : (
                      <p className="text-gray-500 mt-2">
                        {t("No campaigns awaiting review")}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  campaigns.map((campaign) => (
                    <motion.div
                      key={campaign._id}
                      layout
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      className={`group relative p-4 rounded-xl cursor-pointer
                      border-2 ${
                        selectedCampaign?._id === campaign._id
                          ? "border-orange-200 bg-orange-50 shadow-inner"
                          : "border-transparent bg-white hover:border-orange-100"
                      }
                      hover:bg-orange-50 transition-all shadow-sm hover:shadow-md`}
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
                          {!isSidebarCollapsed && (
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate pr-6">
                                {campaign.title}
                              </h3>
                              <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                                {campaign.category}
                              </span>
                            </div>
                          )}
                        </div>
                        {!isSidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-gray-400 shrink-0"
                          >
                            {formatDate(campaign.createdAt)}
                          </motion.span>
                        )}
                      </motion.div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </LayoutGroup>
          </nav>
        </motion.aside>
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-6 sm:p-8 max-w-7xl mx-auto">
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
                    {t("Select a campaign")}
                  </h3>
                  <p className="text-gray-500">
                    {t(
                      "Choose a campaign from the sidebar to view detailed information and perform validation actions."
                    )}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedCampaign._id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8 border border-gray-100"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {selectedCampaign.title}
                      </h1>
                      <div className="mt-2 flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                            selectedCampaign.status
                          )}`}
                        >
                          {selectedCampaign.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {t("Created ")}{" "}
                          {formatDate(selectedCampaign.createdAt)}
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
                        {t("Campaign Overview")}
                      </h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line break-words overflow-hidden max-w-full">
                        {" "}
                        {selectedCampaign.description ||
                          "No description provided"}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <DollarSign className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              {t("Funding Goal")}
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                              ETB{" "}
                              {selectedCampaign.goalAmount?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              {t("Campaign Duration")}
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {formatDate(selectedCampaign.startDate)} -{" "}
                              {formatDate(selectedCampaign.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedCampaign.image?.length > 0 && (
                      <section className="space-y-4">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-6 h-6 text-purple-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {t("Campaign Images")} (
                            {selectedCampaign.image.length})
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {selectedCampaign.image.map((img, index) => (
                            <div
                              key={index}
                              className="relative group aspect-square rounded-xl overflow-hidden shadow-sm"
                            >
                              <img
                                src={img}
                                alt={`Campaign visual ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                    {selectedCampaign.video?.length > 0 && (
                      <section className="space-y-4">
                        <div className="flex items-center gap-3">
                          <VideoIcon className="w-6 h-6 text-red-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {t("Campaign Videos")} (
                            {selectedCampaign.video.length})
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedCampaign.video.map((video, index) => (
                            <div
                              key={index}
                              className="relative bg-black rounded-xl overflow-hidden shadow-lg"
                            >
                              <video
                                controls
                                className="w-full aspect-video"
                                preload="metadata"
                              >
                                <source
                                  src={`${video}#t=0.5`}
                                  type="video/mp4"
                                />
                                {t(
                                  "Your browser does not support the video tag."
                                )}
                              </video>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                    {(selectedCampaign.document?.length > 0 ||
                      selectedCampaign.link?.length > 0) && (
                      <section className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-amber-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {t("Supporting Materials")}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedCampaign.document?.map((doc, index) => (
                            <a
                              key={`doc-${index}`}
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
                            </a>
                          ))}
                          {selectedCampaign.link?.map((link, index) => (
                            <a
                              key={`link-${index}`}
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
                            </a>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
                      <div className="text-sm text-gray-500">
                        {t("Campaign ID")}: {selectedCampaign._id}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={async () => {
                            const reason = prompt(
                              "Rejection reason:",
                              "Does not meet community guidelines"
                            );
                            if (reason) {
                              await handleStatusUpdate("rejected", reason);
                            }
                          }}
                          disabled={updateCampaignMutation.isLoading}
                          className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          {updateCampaignMutation.isLoading
                            ? "Processing..."
                            : "Reject"}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate("approved")}
                          disabled={updateCampaignMutation.isLoading}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          {updateCampaignMutation.isLoading
                            ? "Processing..."
                            : "Approve"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ValidatorPage;
