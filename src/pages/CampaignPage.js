import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CampaignPage = () => {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    pending: "text-yellow-600",
    active: "text-green-600",
    rejected: "text-red-600",
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/campaigns/${campaignId}`
        );
        if (response.data.success) {
          setCampaign(response.data.campaign);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Campaign Not Found
          </h1>
          <p className="text-gray-600">
            The campaign you're looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Photo Section */}
          <div className="md:w-1/2">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {campaign.title}
            </h1>
            <p className="text-gray-600 mb-6">{campaign.description}</p>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Status:</span>
              <span
                className={`ml-2 text-sm font-semibold ${
                  statusColors[campaign.status] || "text-gray-600"
                }`}
              >
                {campaign.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPage;