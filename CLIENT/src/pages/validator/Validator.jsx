import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  FileText,
  Video as VideoIcon,
  Image as ImageIcon,
} from "lucide-react";

const Validator = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch campaigns from the API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/campaigns?status=pending"
        );
        setCampaigns(response.data);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Approve a campaign
  const approveCampaign = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/campaigns/${id}`, {
        status: "active",
      });
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign._id === id ? { ...campaign, status: "active" } : campaign
        )
      );
    } catch (error) {
      console.error("Failed to approve campaign:", error);
    }
  };

  // Reject a campaign
  const rejectCampaign = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((campaign) => campaign._id !== id));
    } catch (error) {
      console.error("Failed to reject campaign:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6 border-r border-gray-200">
        <h2 className="text-xl font-bold text-orange-600">Pending Campaigns</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-gray-500">No pending campaigns.</p>
        ) : (
          campaigns.map((campaign) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg cursor-pointer ${
                selectedCampaign?._id === campaign._id
                  ? "bg-orange-50 shadow-md"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCampaign(campaign)}
            >
              <p className="font-medium text-orange-700">{campaign.title}</p>
              <p className="text-sm text-gray-500">{campaign.category}</p>
            </motion.div>
          ))
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {!selectedCampaign ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500"
          >
            <p>Select a campaign from the sidebar to review.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              key={selectedCampaign._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 space-y-6"
            >
              {/* Campaign Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-orange-600">
                  {selectedCampaign.title}
                </h1>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCampaign.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedCampaign.status.charAt(0).toUpperCase() +
                    selectedCampaign.status.slice(1)}
                </span>
              </div>

              {/* Campaign Details */}
              <div className="space-y-4">
                <p className="text-gray-600">{selectedCampaign.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Goal Amount</p>
                    <p className="text-lg font-medium text-orange-600">
                      ${selectedCampaign.goalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="text-lg font-medium">
                      {selectedCampaign.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="text-lg font-medium">
                      {new Date(
                        selectedCampaign.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-medium">
                      {selectedCampaign.status.charAt(0).toUpperCase() +
                        selectedCampaign.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5 text-gray-500" /> Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {selectedCampaign.image.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Campaign ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>

              {selectedCampaign.video.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 flex items-center">
                    <VideoIcon className="mr-2 h-5 w-5 text-gray-500" /> Video
                  </h3>
                  <video controls className="w-full rounded-lg shadow-md mt-2">
                    <source
                      src={selectedCampaign.video[0].url}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {selectedCampaign.document.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-gray-500" />{" "}
                    Supporting Documents
                  </h3>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    {selectedCampaign.document.map((doc, index) => (
                      <li key={index} className="text-gray-600">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.url.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => rejectCampaign(selectedCampaign._id)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors flex items-center"
                >
                  <XCircle className="mr-2 h-5 w-5" /> Reject
                </button>
                <button
                  onClick={() => approveCampaign(selectedCampaign._id)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors flex items-center"
                >
                  <CheckCircle className="mr-2 h-5 w-5" /> Approve
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default Validator;
