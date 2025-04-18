import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';

const ValidatorDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const { user, loginValidator } = useAuth();

  // Auto-login as validator if not logged in
  useEffect(() => {
    if (!user) loginValidator();
  }, [user, loginValidator]);

  // Fetch pending campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/campaigns?status=pending');
        setCampaigns(data);
      } catch (err) {
        toast.error('Failed to load campaigns');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === 'validator') fetchCampaigns();
  }, [user]);

  // Handle validation
  const handleValidation = async (campaignId, status) => {
    try {
      setProcessingId(campaignId);
      let reason;
      
      if (status === 'rejected') {
        reason = prompt('Enter rejection reason:');
        if (!reason?.trim()) {
          toast.warning('Reason required for rejection');
          return;
        }
      }

      await axios.patch(`/api/campaigns/${campaignId}/status`, { 
        status, 
        reason 
      });

      setCampaigns(prev => prev.filter(c => c._id !== campaignId));
      toast.success(`Campaign ${status}`);
    } catch (err) {
      toast.error(`Validation failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (user?.role !== 'validator') {
    return (
      <div className="p-6 text-center">
        <p>You must be a validator to access this page</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Campaign Validations</h1>
      <p className="mb-4">Logged in as: {user.name} (Validator)</p>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No pending campaigns to validate</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(campaign => (
            <div key={campaign._id} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
              <p className="text-gray-600 mb-4">{campaign.description}</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleValidation(campaign._id, 'approved')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  {processingId === campaign._id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCheckCircle />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleValidation(campaign._id, 'rejected')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  {processingId === campaign._id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTimesCircle />
                  )}
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ValidatorDashboard;