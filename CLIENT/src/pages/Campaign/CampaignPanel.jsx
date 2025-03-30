import { useEffect, useState } from "react";
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

const CampaignDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns");
        if (!response.ok) throw new Error("Failed to fetch campaigns");
        const { data } = await response.json();
        setCampaigns(Array.isArray(data) ? data : [data]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEditClick = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
    });
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/campaigns/${editingCampaign._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const updatedCampaign = await response.json();
      setCampaigns(
        campaigns.map((camp) =>
          camp._id === updatedCampaign.data._id ? updatedCampaign.data : camp
        )
      );
      setEditingCampaign(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = campaigns.map((campaign) => ({
    name:
      campaign.title.substring(0, 15) +
      (campaign.title.length > 15 ? "..." : ""),
    raised: campaign.raisedAmount || 0,
    goal: campaign.goalAmount || 0,
    progress: ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100,
  }));

  const getStatusColor = (status) => {
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 items-center justify-center">
        <Loader
          size={80} // Control overall size
          color="text-blue-500" // Change main color
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 items-center justify-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4"
        >
          <div className="text-red-500 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
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
      {/* Edit Campaign Modal */}
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
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Goal ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.goalAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, goalAmount: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
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
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                  >
                    {isSubmitting ? (
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

      {/* Sidebar */}
      <motion.div
        initial="expanded"
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="bg-white shadow-2xl overflow-hidden relative"
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
              <motion.li
                key={tab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
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
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
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

          {/* Campaign Cards Grid */}
          <LayoutGroup>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <AnimatePresence>
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign._id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    {campaign.image?.length > 0 && (
                      <div className="relative h-48 overflow-hidden group">
                        <img
                          src={campaign.image[0]}
                          alt="Main campaign visual"
                          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`px-3 py-1 rounded-full text-white text-sm inline-block ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {campaign.status || "pending"}
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
                            <span>
                              {Math.round(
                                ((campaign.raisedAmount || 0) /
                                  (campaign.goalAmount || 1)) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  ((campaign.raisedAmount || 0) /
                                    (campaign.goalAmount || 1)) *
                                  100
                                }%`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-full h-3 relative overflow-hidden"
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
                              ${(campaign.raisedAmount || 0).toLocaleString()}
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
                              ${(campaign.goalAmount || 0).toLocaleString()}
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
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          >
                            <Trash2 size={20} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {/* Analytics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Funding Progress Analytics
              </h2>
            </div>

            <div className="h-96">
              {campaigns.length > 0 ? (
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
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-semibold">
                                {payload[0].payload.name}
                              </p>
                              <p className="text-orange-600">
                                Raised: ${payload[0].value.toLocaleString()}
                              </p>
                              <p className="text-blue-600">
                                Goal: ${payload[1].value.toLocaleString()}
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
  );
};

export default CampaignDashboard;
