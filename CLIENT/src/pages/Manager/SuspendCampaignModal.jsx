import React, { useState, useEffect } from "react";
import { useSuspendReallocate } from "../../hooks/useRelease";
import API from "../../api/api";
const SuspendCampaignModal = ({ isOpen, onClose, campaignToSuspend }) => {
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [unallocatedAmount, setUnallocatedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && campaignToSuspend) {
      fetchActiveCampaigns();
    }
  }, [isOpen, campaignToSuspend]);

  useEffect(() => {
    console.log(activeCampaigns);
  }, [activeCampaigns]);

  const fetchActiveCampaigns = async () => {
    setIsLoading(true);
    try {
      // Fetch all active campaigns except the one being suspended
      const response = await API.get(
        `/campaigns/active/${campaignToSuspend._id}`
      );

      const campaigns = await response.data.data;
      setActiveCampaigns(campaigns);
      if (campaigns.length === 0) {
        setError(
          "No active campaigns available for reallocation. Cannot proceed with suspension."
        );
      } else {
        // Calculate initial allocations
        calculateInitialAllocations(campaigns, campaignToSuspend.raisedAmount);
      }
    } catch (err) {
      setError("Failed to fetch active campaigns");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    mutate,
    isPending: isSubmitting,
    isSuccess,
    reset,
  } = useSuspendReallocate();

  const calculateInitialAllocations = (campaigns, totalAmount) => {
    if (!campaigns.length) {
      setUnallocatedAmount(totalAmount);
      setAllocations({});
      return;
    }

    // Calculate how much each campaign still needs to reach their goal
    const campaignNeeds = campaigns.map((campaign) => ({
      id: campaign._id,
      amountNeeded: Math.max(0, campaign.goalAmount - campaign.raisedAmount),
    }));

    // Calculate total needs
    const totalNeeded = campaignNeeds.reduce(
      (sum, campaign) => sum + campaign.amountNeeded,
      0
    );

    const newAllocations = {};
    let remainingAmount = totalAmount;

    // If total needed is less than what we have to distribute
    if (totalNeeded <= remainingAmount) {
      // Give each campaign what they need
      campaignNeeds.forEach((campaign) => {
        newAllocations[campaign.id] = campaign.amountNeeded;
        remainingAmount -= campaign.amountNeeded;
      });
      // If we still have remaining funds, distribute them evenly
      if (remainingAmount > 0 && campaigns.length > 0) {
        const additionalPerCampaign = remainingAmount / campaigns.length;
        campaigns.forEach((campaign) => {
          newAllocations[campaign.id] =
            (newAllocations[campaign.id] || 0) + additionalPerCampaign;
        });
        remainingAmount = 0;
      }
    } else {
      // Distribute proportionally based on needs
      campaignNeeds.forEach((campaign) => {
        if (campaign.amountNeeded > 0) {
          const proportion = campaign.amountNeeded / totalNeeded;
          newAllocations[campaign.id] = Math.min(
            campaign.amountNeeded,
            Math.floor(remainingAmount * proportion * 100) / 100 // Round to 2 decimal places
          );
        } else {
          newAllocations[campaign.id] = 0;
        }
      });

      // Check if there's any unallocated amount due to rounding
      const allocatedAmount = Object.values(newAllocations).reduce(
        (sum, amount) => sum + amount,
        0
      );
      remainingAmount = parseFloat((totalAmount - allocatedAmount).toFixed(2));

      // Distribute any remaining amount to the first campaign with needs
      if (remainingAmount > 0) {
        for (const campaign of campaignNeeds) {
          if (campaign.amountNeeded > newAllocations[campaign.id]) {
            newAllocations[campaign.id] = parseFloat(
              (newAllocations[campaign.id] + remainingAmount).toFixed(2)
            );
            remainingAmount = 0;
            break;
          }
        }

        // If we still have remaining funds, add to the first campaign
        if (remainingAmount > 0 && campaigns.length > 0) {
          const firstCampaignId = campaigns[0].id;
          newAllocations[firstCampaignId] = parseFloat(
            (newAllocations[firstCampaignId] + remainingAmount).toFixed(2)
          );
          remainingAmount = 0;
        }
      }
    }

    setAllocations(newAllocations);
    setUnallocatedAmount(remainingAmount);
  };

  const handleAllocationChange = (campaignId, value) => {
    const numValue = parseFloat(value) || 0;

    // Validate that the value is not negative
    if (numValue < 0) return;

    // Update allocation for this campaign
    const newAllocations = { ...allocations, [campaignId]: numValue };
    setAllocations(newAllocations);

    // Recalculate unallocated amount
    const totalAllocated = Object.values(newAllocations).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const newUnallocatedAmount = parseFloat(
      (campaignToSuspend.raisedAmount - totalAllocated).toFixed(2)
    );

    setUnallocatedAmount(newUnallocatedAmount);
  };

  const isAllFundsAllocated = () => {
    return Math.abs(unallocatedAmount) < 0.01; // Allow for tiny rounding errors
  };

  const handleSubmit = async () => {
    // Check if all funds are allocated
    if (!isAllFundsAllocated()) {
      setError(
        `Please allocate all funds. You still have $${unallocatedAmount.toFixed(
          2
        )} unallocated.`
      );
      return;
    }
    mutate({ id: campaignToSuspend._id, allocations });
  };
  useEffect(() => {
    console.log(isSuccess);

    if (isSuccess) {
      onClose();
      reset();
    }
  }, [isSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-orange-500 text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold">
            Suspend Campaign and Reallocate Funds
          </h2>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Campaign to Suspend</h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="font-medium">{campaignToSuspend?.title}</p>
              <p className="text-gray-700">
                {`Available funds: ${campaignToSuspend?.raisedAmount.toFixed(
                  2
                )} Birr`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          ) : activeCampaigns.length === 0 ? (
            <div className="bg-orange-100 text-orange-700 p-4 rounded-lg mb-4">
              No active campaigns found for reallocation. Cannot proceed with
              suspension.
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Reallocate to Active Campaigns
              </h3>
              <p className="text-gray-600 mb-4">
                {`You must allocate all 
                ${campaignToSuspend?.raisedAmount.toFixed(2)} Birr to proceed
                with the suspension.`}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="py-2 px-4 text-left">Campaign</th>
                      <th className="py-2 px-4 text-left">Current Amount</th>
                      <th className="py-2 px-4 text-left">Goal</th>
                      <th className="py-2 px-4 text-left">Still Needed</th>
                      <th className="py-2 px-4 text-left">Allocate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCampaigns.map((campaign) => {
                      const amountNeeded = Math.max(
                        0,
                        campaign.goalAmount - campaign.raisedAmount
                      );
                      console.log(
                        campaign.title,
                        amountNeeded,
                        campaign.goalAmount - campaign.raisedAmount
                      );

                      return (
                        <tr
                          key={campaign.id}
                          className="border-b hover:bg-orange-50"
                        >
                          <td className="py-3 px-4">{campaign.title}</td>
                          <td className="py-3 px-4">
                            {campaign.raisedAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {campaign.goalAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {amountNeeded > 0 ? (
                              <span className="text-orange-600 font-medium">
                                {amountNeeded.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-green-600 font-medium">
                                Fully Funded
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={allocations[campaign.id] || 0}
                              onChange={(e) =>
                                handleAllocationChange(
                                  campaign.id,
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div
                className={`mt-6 p-4 rounded-lg ${
                  unallocatedAmount > 0
                    ? "bg-orange-100 text-orange-700"
                    : unallocatedAmount < 0
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <p className="font-semibold">
                  {unallocatedAmount > 0
                    ? `Unallocated amount: ${unallocatedAmount.toFixed(2)}`
                    : unallocatedAmount < 0
                    ? `Over-allocated by: ${Math.abs(unallocatedAmount).toFixed(
                        2
                      )}`
                    : "All funds allocated successfully!"}
                </p>
                {unallocatedAmount !== 0 && (
                  <p className="text-sm mt-1">
                    {unallocatedAmount > 0
                      ? "You must allocate all funds to proceed."
                      : "Please reduce allocations to match the available amount."}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none disabled:bg-orange-300"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !isAllFundsAllocated() ||
              activeCampaigns.length === 0
            }
          >
            {isSubmitting ? "Processing..." : "Confirm Reallocation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendCampaignModal;
