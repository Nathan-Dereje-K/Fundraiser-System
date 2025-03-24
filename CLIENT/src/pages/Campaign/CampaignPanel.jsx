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
import { motion, AnimatePresence } from "framer-motion";

const CampaignDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns");
        if (!response.ok) throw new Error("Failed to fetch campaigns");
        const { data } = await response.json();
        setCampaigns(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = campaigns.map((campaign) => ({
    name: campaign.title,
    raised: campaign.raisedAmount || 0,
    goal: campaign.goalAmount || 0,
  }));

  const getStatusColor = (status) => {
    switch ((status || "pending").toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "approved":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      case "completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Loader2 className="h-12 w-12 text-orange-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-500">{error}</h2>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial="expanded"
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="bg-white shadow-lg overflow-hidden"
      >
        <div className="p-4 flex justify-between items-center border-b">
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-xl"
              >
                Dashboard
              </motion.h2>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </motion.button>
        </div>
        <nav className="p-4">
          <motion.ul className="space-y-2">
            {["overview", "statistics", "history"].map((tab) => (
              <motion.li
                key={tab}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTab(tab)}
                  className={`flex items-center space-x-2 w-full p-2 rounded-lg ${
                    selectedTab === tab
                      ? "bg-orange-100 text-orange-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {tab === "overview" && <Layout size={20} />}
                  {tab === "statistics" && <BarChart3 size={20} />}
                  {tab === "history" && <History size={20} />}
                  {!isSidebarCollapsed && (
                    <span className="capitalize">{tab}</span>
                  )}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-2xl font-bold">Campaign Management</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              to="/campaign_creation"
            >
              <Plus size={20} />
              <span>New Campaign</span>
            </motion.button>
          </motion.div>

          {/* Campaign Cards */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence>
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-lg shadow-md p-6"
                  whileHover={{ y: -5 }}
                >
                  {/* Image Section */}
                  {campaign.image?.length > 0 && (
                    <div className="mb-4">
                      <div className="grid gap-2">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden">
                          <img
                            src={campaign.image[0]}
                            alt="Main campaign visual"
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        {campaign.image.length > 1 && (
                          <div className="flex flex-wrap gap-2">
                            {campaign.image.slice(1).map((img, idx) => (
                              <div
                                key={idx}
                                className="relative h-16 w-16 rounded-md overflow-hidden cursor-pointer"
                              >
                                <img
                                  src={img}
                                  alt={`Campaign thumbnail ${idx + 2}`}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Campaign Images
                      </p>
                    </div>
                  )}

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
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
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            ((campaign.raisedAmount || 0) /
                              (campaign.goalAmount || 1)) *
                            100
                          }%`,
                        }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="bg-orange-500 rounded-full h-2"
                      />
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Raised</p>
                      <p className="font-semibold">
                        ${(campaign.raisedAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Goal</p>
                      <p className="font-semibold">
                        ${(campaign.goalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status and Category */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{campaign.title}</h3>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status || "pending"}
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit3 size={20} className="text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 size={20} className="text-gray-600" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Campaign Progress</h2>
            <div className="h-96">
              {campaigns.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="raised" fill="#2563eb" name="Raised" />
                    <Bar dataKey="goal" fill="#93c5fd" name="Goal" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No campaign data available
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
