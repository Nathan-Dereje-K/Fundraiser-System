import { useState, useRef, useEffect } from "react";
import {
  useCampaigns,
  useUpdateCampaign,
  useDeleteCampaign,
  useMyCampaigns,
} from "../../hooks/useCampaign";
import {
  Layout,
  BarChart3,
  History,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Plus,
  Loader2,
  DollarSign,
  Target,
  Clock,
  PieChart,
  X,
  Save,
  ImageIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../components/ui/Loader";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/layout/Navbar";

const CampaignDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const overviewRef = useRef(null);
  const statisticsRef = useRef(null);
  const historyRef = useRef(null);

  const { data: campaigns, isLoading, isError, error } = useMyCampaigns();
  const updateCampaignMutation = useUpdateCampaign();
  const deleteCampaignMutation = useDeleteCampaign();

  useEffect(() => {
    const handleAutoComplete = async () => {
      if (!campaigns) return;

      for (const campaign of campaigns) {
        const isFunded =
          (campaign.raisedAmount || 0) >= (campaign.goalAmount || 1);
        const shouldUpdate = isFunded && campaign.status !== "completed";

        if (shouldUpdate) {
          try {
            await updateCampaignMutation.mutateAsync({
              id: campaign._id,
              status: "completed",
            });
          } catch (error) {
            console.error("Failed to update status:", error);
          }
        }
      }
    };

    handleAutoComplete();
  }, [campaigns]);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const refs = {
      overview: overviewRef,
      statistics: statisticsRef,
      history: historyRef,
    };
    refs[selectedTab]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedTab]);

  const handleEditClick = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
    });
  };

  // const handleReleaseClick = (campaign) => {
  //   if (
  //     window.confirm(
  //       "Are you sure you want to request a release for this campaign?"
  //     )
  //   ) {
  //     updateCampaignMutation.mutate({
  //       id: campaign._id,
  //       releaseStatus: "requested",
  //     });
  //   }
  // };

  const handleDeleteCampaign = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="text-sm font-medium text-gray-800">
            Are you sure you want to delete this campaign?
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => {
                deleteCampaignMutation.mutate(id);
                toast.dismiss();
                toast.success("Campaign deleted successfully!");
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      await updateCampaignMutation.mutateAsync({
        id: editingCampaign._id,
        ...formData,
      });
      toast.success("Campaign is updated successfully!");
      setEditingCampaign(null);
    } catch (error) {
      toast.error("Failed to update campaign. Please try again.");
      console.error("Update failed:", error);
    }
  };

  const chartData =
    campaigns?.map((campaign) => {
      const progress = Math.min(
        ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100, // Added missing closing parenthesis
        100
      );
      return {
        name:
          campaign.title.substring(0, 15) +
          (campaign.title.length > 15 ? "..." : ""),
        raised: campaign.raisedAmount || 0,
        goal: campaign.goalAmount || 0,
        progress,
      };
    }) || [];

  const getStatusColor = (status, isFunded) => {
    if (isFunded) return "bg-gradient-to-r from-green-400 to-green-600";
    switch ((status || "pending").toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-400 to-green-600";
      case "approved":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "pending":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "rejected":
        return "bg-gradient-to-r from-red-400 to-red-600";
      case "completed":
        return "bg-gradient-to-r from-purple-400 to-purple-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 items-center justify-center">
        <Loader size={80} color="text-blue-500" />
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
    <div>
      <div className="overflow-y-hidden-hidden">
        <Navbar />
      </div>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <AnimatePresence>
          {editingCampaign && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
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
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 h-32"
                    />
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
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                    >
                      {updateCampaignMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Update Campaign
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
                  className="font-bold text-2xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
                >
                  Campaign Panel
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
              {["overview", "statistics", "history"].map((tab) => (
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
                    {tab === "overview" && <Layout size={24} />}
                    {tab === "statistics" && <BarChart3 size={24} />}
                    {tab === "history" && <History size={24} />}
                    {!isSidebarCollapsed && (
                      <span className="capitalize font-medium">{tab}</span>
                    )}
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
        </motion.aside>
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
            >
              <div>
                <h1
                  ref={overviewRef}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  Your Campaigns
                </h1>
                <p className="text-gray-600">
                  Manage and track your fundraising progress
                </p>
              </div>
              <Link to="/campaign_creation">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-orange-200 transition-shadow"
                >
                  <Plus size={20} />
                  <span>Launch New Campaign</span>
                </motion.button>
              </Link>
            </motion.div>
            <LayoutGroup>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <AnimatePresence>
                  {campaigns?.map((campaign, index) => {
                    const progressPercentage = Math.round(
                      ((campaign.raisedAmount || 0) /
                        (campaign.goalAmount || 1)) *
                        100
                    );
                    const cappedPercentage = Math.min(progressPercentage, 100);
                    const isFunded = progressPercentage >= 100;
                    const displayStatus = isFunded
                      ? "completed"
                      : campaign.status;
                    return (
                      <motion.div
                        key={campaign._id}
                        layout
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                      >
                        {campaign.image?.length > 0 ? (
                          <div className="relative h-48 overflow-hidden group">
                            <img
                              src={campaign.image[0]}
                              alt="Main campaign visual"
                              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <motion.div
                                className={`px-3 py-1 rounded-full text-white text-sm inline-block ${getStatusColor(
                                  displayStatus,
                                  isFunded
                                )}`}
                              >
                                {displayStatus}
                              </motion.div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <motion.div
                                className={`px-3 py-1 rounded-full text-white text-sm inline-block ${getStatusColor(
                                  displayStatus,
                                  isFunded
                                )}`}
                              >
                                {displayStatus}
                              </motion.div>
                            </div>
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            {campaign.title}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span
                                  className={
                                    isFunded
                                      ? "text-green-600 font-semibold"
                                      : ""
                                  }
                                >
                                  {progressPercentage}%
                                  {isFunded && " 🎉 Funded!"}
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${cappedPercentage}%` }}
                                  transition={{
                                    duration: 1,
                                    delay: index * 0.1,
                                  }}
                                  className={`h-3 relative ${
                                    isFunded
                                      ? "bg-gradient-to-r from-green-400 to-green-600"
                                      : "bg-gradient-to-r from-orange-400 to-orange-600"
                                  }`}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent w-1/2" />
                                </motion.div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                  <DollarSign className="w-5 h-5 text-green-600" />
                                  <span className="text-sm text-gray-600">
                                    Raised
                                  </span>
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                  ETB{" "}
                                  {(
                                    campaign.raisedAmount || 0
                                  ).toLocaleString()}
                                </div>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                  <Target className="w-5 h-5 text-blue-600" />
                                  <span className="text-sm text-gray-600">
                                    Goal
                                  </span>
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                  ETB{" "}
                                  {(campaign.goalAmount || 0).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditClick(campaign)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                              >
                                <Edit3 size={20} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleDeleteCampaign(campaign._id)
                                }
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                              >
                                <Trash2 size={20} />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              ref={statisticsRef}
              className="bg-white rounded-2xl shadow-lg p-6 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <PieChart className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Funding Progress Analytics
                </h2>
              </div>
              <div className="h-96">
                {campaigns?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#4b5563", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value}`}
                        tick={{ fill: "#4b5563" }}
                        axisLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload?.length) {
                            return (
                              <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                                <p className="font-semibold">
                                  {payload[0].payload.name}
                                </p>
                                <p className="text-orange-600">
                                  Raised: ETB{" "}
                                  {payload[0].value.toLocaleString()}
                                </p>
                                <p className="text-blue-600">
                                  Goal: ETB {payload[1].value.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                  Progress:{" "}
                                  {Math.round(payload[0].payload.progress)}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="raised"
                        stackId="a"
                        fill="#f97316"
                        name="Raised Amount"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="goal"
                        stackId="a"
                        fill="#e5e7eb"
                        name="Remaining Goal"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <Clock className="w-12 h-12" />
                    <p className="text-lg">No campaign data available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDashboard;
