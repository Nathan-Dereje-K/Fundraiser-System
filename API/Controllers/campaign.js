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

// @Desc       Display single Campaigns
// @Route      GET /api/campaign
// @Access     Public
exports.getCampaign = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const campaign = await Campaign.findById(id);
  res.status(200).json({ success: true, data: campaign });
});

// @Desc       Create new Campaign
// @Route      POST /api/campaign
// @Access     Private
exports.postCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create(req.body);
  res.status(201).json({ success: true, data: campaign });
});

// @Desc       Update Campaign
// @Route      PUT /api/campaign
// @Access     Private
exports.putCampaign = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const campaign = await Campaign.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: campaign });
});

// @Desc       Delete Campaign
// @Route      DELETE /api/campaign
// @Access     Private
exports.deleteCampaign = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await Campaign.findByIdAndDelete(id);
  res.status(200).json({ success: true, data: {} });
});
