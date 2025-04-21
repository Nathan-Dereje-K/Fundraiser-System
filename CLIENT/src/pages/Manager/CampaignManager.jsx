import { useState } from "react";
import {
  useCampaigns,
  useUpdateCampaign,
  useDeleteCampaign,
} from "../../hooks/useCampaign";
import { useReleaseMoney } from "../../hooks/useRelease";
import {
  LayoutGrid,
  Flag,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Target,
  X,
  DollarSign,
  PauseCircle,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Loader from "../../components/ui/Loader";
import SuspendCampaignModal from "./SuspendCampaignModal";
import { toast } from "react-toastify";

const CampaignManager = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("campaigns");
  const [expandedCampaignId, setExpandedCampaignId] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: 0,
    category: "",
    startDate: "",
    endDate: "",
  });
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleSuspendClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsSuspendModalOpen(true);
  };

  const { data: campaigns, isLoading, isError, error } = useCampaigns();
  const updateCampaignMutation = useUpdateCampaign();
  const deleteCampaignMutation = useDeleteCampaign();
  const releaseMoneyMutation = useReleaseMoney();

  const handleStatusToggle = async (campaign) => {
    const newStatus = campaign.status === "approved" ? "rejected" : "approved";
    try {
      await updateCampaignMutation.mutateAsync({
        id: campaign._id,
        status: newStatus,
      });
      toast.success(
        `Campaign ${
          newStatus === "approved" ? "approved" : "rejected"
        } successfully!`
      );
    } catch (error) {
      toast.error(
        `Failed to ${newStatus === "approved" ? "approve" : "reject"} campaign.`
      );
      console.error("Status update failed:", error);
    }
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      await updateCampaignMutation.mutateAsync({
        id: editingCampaign._id,
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      setEditingCampaign(null);
      toast.success("Campaign updated successfully!");
    } catch (error) {
      toast.error("Failed to update campaign.");
      console.error("Update failed:", error);
    }
  };
  const handleReleaseCampaign = async (campaign) => {
    if (window.confirm("Are you sure you want to release this campaign?")) {
      try {
        await releaseMoneyMutation.mutateAsync(campaign._id);
      } catch (error) {
        console.error("Release failed:", error);
      }
    }
  };

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-sm flex items-center gap-2";
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <div
            className={`${baseClasses} bg-gradient-to-r from-green-400 to-green-600 text-white`}
          >
            <CheckCircle2 size={16} />
            Approved
          </div>
        );
      case "rejected":
        return (
          <div
            className={`${baseClasses} bg-gradient-to-r from-red-400 to-red-600 text-white`}
          >
            <XCircle size={16} />
            Rejected
          </div>
        );
      default:
        return (
          <div
            className={`${baseClasses} bg-gradient-to-r from-gray-400 to-gray-600 text-white`}
          >
            {status}
          </div>
        );
    }
  };

  const getReleaseStatus = (status) => {
    if (status === "requested") {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-sm mr-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
          <DollarSign size={14} />
          Release Requested
        </span>
      );
    } else if (status === "released") {
      return (
        <span className="bg-green-500 text-white text-sm mr-2 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <DollarSign size={14} />
          Released
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 items-center justify-center">
        <Loader size={80} color="text-orange-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 items-center justify-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4"
        >
          <div className="text-red-500 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error?.message || "Failed to load campaigns"}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
            onClick={() => window.location.reload()}
          >
            Refresh Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <motion.aside
        initial="expanded"
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="bg-white shadow-2xl border-r border-gray-100"
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-2xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
              >
                Manager Panel
              </motion.h2>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl hover:bg-gray-50 text-gray-600"
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </motion.button>
        </div>

        <nav className="p-4">
          <motion.ul className="space-y-3">
            {["campaigns", "reports"].map((tab) => (
              <motion.li key={tab}>
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTab(tab)}
                  className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
                    selectedTab === tab
                      ? "bg-orange-50 text-orange-600 shadow-inner"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {tab === "campaigns" && <LayoutGrid size={24} />}
                  {tab === "reports" && <Flag size={24} />}
                  {!isSidebarCollapsed && (
                    <span className="capitalize font-medium">
                      {tab === "campaigns" ? "Campaigns" : "Reports"}
                    </span>
                  )}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {selectedTab === "campaigns" ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Campaign Management
              </h1>
              <p className="text-gray-600">
                Manage and moderate all fundraising campaigns
              </p>
            </div>

            <LayoutGroup>
              <motion.div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {campaigns?.map((campaign) => (
                    <motion.div
                      key={campaign._id}
                      layout
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">
                                {campaign.title}
                              </h3>
                              {getStatusBadge(campaign.status)}
                              {getReleaseStatus(campaign.releaseStatus)}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>
                                  {formatDate(campaign.startDate)} -{" "}
                                  {formatDate(campaign.endDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target size={16} />
                                <span>
                                  Goal: {campaign.goalAmount?.toLocaleString()}{" "}
                                  Birr
                                </span>
                              </div>
                              {/* raised money */}
                              <div className="flex items-center gap-1">
                                <DollarSign size={16} />
                                <span>
                                  Raised:{" "}
                                  {campaign.raisedAmount?.toLocaleString()} Birr
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                setExpandedCampaignId(
                                  expandedCampaignId === campaign._id
                                    ? null
                                    : campaign._id
                                )
                              }
                              className="p-2 hover:bg-gray-50 rounded-lg"
                            >
                              {expandedCampaignId === campaign._id ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )}
                            </motion.button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedCampaignId === campaign._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-100"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                      <CalendarDays size={18} />
                                      Campaign Timeline
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="font-medium w-16">
                                          Start:
                                        </span>
                                        <span>
                                          {formatDate(campaign.startDate)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="font-medium w-16">
                                          End:
                                        </span>
                                        <span>
                                          {formatDate(campaign.endDate)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-medium mb-2">
                                    Management Actions
                                  </h4>
                                  <div className="flex flex-wrap gap-3">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        handleStatusToggle(campaign)
                                      }
                                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        campaign.status === "approved"
                                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                                          : "bg-green-100 text-green-800 hover:bg-green-200"
                                      }`}
                                    >
                                      {campaign.status === "approved" ? (
                                        <XCircle size={16} />
                                      ) : (
                                        <CheckCircle2 size={16} />
                                      )}
                                      {campaign.status === "approved"
                                        ? "Reject Campaign"
                                        : "Approve Campaign"}
                                    </motion.button>
                                    {campaign.releaseStatus !== "released" && (
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                          handleReleaseCampaign(campaign)
                                        }
                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 bg-red-100 text-red-800 hover:bg-red-200 `}
                                      >
                                        <DollarSign size={16} />
                                        Release
                                      </motion.button>
                                    )}
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        handleSuspendClick(campaign)
                                      }
                                      className={`px-4 py-2 rounded-lg flex items-center gap-2 bg-green-100 text-green-800 hover:bg-green-200 `}
                                    >
                                      <PauseCircle size={16} />
                                      Suspend
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => {
                                        setEditingCampaign(campaign);
                                        setFormData({
                                          title: campaign.title,
                                          description: campaign.description,
                                          goalAmount: campaign.goalAmount,
                                          category: campaign.category,
                                          startDate:
                                            campaign.startDate.split("T")[0],
                                          endDate:
                                            campaign.endDate.split("T")[0],
                                        });
                                      }}
                                      className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 flex items-center gap-2"
                                    >
                                      <Edit3 size={16} /> Edit
                                    </motion.button>

                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => {
                                        toast.info(
                                          ({ closeToast }) => (
                                            <div>
                                              <p className="text-sm text-gray-800">
                                                Permanently delete this
                                                campaign?
                                              </p>
                                              <div className="flex gap-3 mt-3">
                                                <button
                                                  onClick={() => {
                                                    deleteCampaignMutation.mutate(
                                                      campaign._id
                                                    );
                                                    toast.dismiss();
                                                    toast.success(
                                                      "Campaign deleted successfully!"
                                                    );
                                                  }}
                                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                >
                                                  Yes
                                                </button>
                                                <button
                                                  onClick={closeToast}
                                                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
                                                >
                                                  No
                                                </button>
                                              </div>
                                            </div>
                                          ),
                                          {
                                            autoClose: false,
                                            closeOnClick: false,
                                            draggable: false,
                                          }
                                        );
                                      }}
                                      className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 flex items-center gap-2"
                                    >
                                      <Trash2 size={16} /> Delete
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center text-gray-500">
              <Flag size={48} className="mx-auto mb-4 text-orange-400" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Reports Dashboard
              </h3>
              <p className="text-gray-600">
                Coming soon - Currently in development
              </p>
            </div>
          </motion.div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editingCampaign && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-2xl w-full max-w-md p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Edit Campaign</h3>
                  <button
                    onClick={() => setEditingCampaign(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleUpdateCampaign} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          min={formData.startDate}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Goal Amount
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.goalAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              goalAmount: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Medical">Medical</option>
                          <option value="Education">Education</option>
                          <option value="Religious">Religious</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditingCampaign(null)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateCampaignMutation.isPending}
                      className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg hover:from-orange-500 hover:to-orange-700 flex items-center gap-2"
                    >
                      {updateCampaignMutation.isPending ? (
                        <Loader size={20} color="text-white" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Suspend and Reallocate Modal */}
      <SuspendCampaignModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        campaignToSuspend={selectedCampaign}
      />
    </div>
  );
};

export default CampaignManager;
