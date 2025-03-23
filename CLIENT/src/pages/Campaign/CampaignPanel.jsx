import { useState } from "react";
import {
  Layout,
  BarChart3,
  //   Users,
  History,
  //   Settings,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Plus,
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
  const [campaigns] = useState([
    {
      id: 1,
      name: "Save the Forests",
      status: "active",
      raised: 1500,
      goal: 10000,
      history: [
        { date: "2025-03-15", action: "Campaign created" },
        { date: "2025-03-16", action: "First donation received" },
      ],
    },
    {
      id: 2,
      name: "Education for All",
      status: "completed",
      raised: 45000,
      goal: 50000,
      history: [{ date: "2025-03-17", action: "Campaign created" }],
    },
    {
      id: 3,
      name: "Education for All",
      status: "pending",
      raised: 35000,
      goal: 50000,
      history: [{ date: "2025-03-17", action: "Campaign created" }],
    },
    {
      id: 4,
      name: "Education for All",
      status: "pending",
      raised: 19000,
      goal: 50000,
      history: [{ date: "2025-03-17", action: "Campaign created" }],
    },
    {
      id: 5,
      name: "Education for All",
      status: "completed",
      raised: 10,
      goal: 50000,
      history: [{ date: "2025-03-17", action: "Campaign created" }],
    },
  ]);

  const chartData = campaigns.map((campaign) => ({
    name: campaign.name,
    raised: campaign.raised,
    goal: campaign.goal,
  }));

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.div
        initial="expanded"
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="bg-white shadow-lg"
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
            >
              <Plus size={20} />
              <span>New Campaign</span>
            </motion.button>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layoutId={`campaign-${campaign.id}`}
                className="bg-white rounded-lg shadow-md p-6"
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </motion.div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {Math.round((campaign.raised / campaign.goal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(campaign.raised / campaign.goal) * 100}%`,
                      }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="bg-orange-500 rounded-full h-2"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Raised</p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-semibold"
                    >
                      ${campaign.raised.toLocaleString()}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Goal</p>
                    <p className="font-semibold">
                      ${campaign.goal.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
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
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Campaign Progress</h2>
            <div className="h-96">
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
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Campaign History</h2>
            <motion.div className="space-y-4">
              {campaigns.map((campaign) =>
                campaign.history.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-gray-600">{event.action}</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {event.date}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDashboard;
