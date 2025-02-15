// getCampaigns, getCampaign, postCampaign, putCampaign, deleteCampaign

const asyncHandler = require("../Middleware/async");
const ErrorResponse = require("../Utils/errorResponse");

// @Desc       Display all Campaigns
// @Route      GET /api/campaigns
// @Access     Public
exports.getCampaigns = asyncHandler(async (req, res) => {
  const campaign = await Campaign.find().sort({ updatedAt: -1 });
  res
    .status(200)
    .json({ success: true, count: campaign.length, data: campaign });
});
