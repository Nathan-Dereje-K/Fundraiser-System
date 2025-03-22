const asyncHandler = require("../Middleware/async");
const ErrorResponse = require("../Utils/errorResponse");
const Campaign = require("../Models/Campaign");

// @Desc       Display all Campaigns with filtering, querying, and sorting
// @Route      GET /api/campaigns
// @Access     Public
exports.getCampaigns = asyncHandler(async (req, res) => {
  let query;
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ["sort", "select", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Advanced filtering (MongoDB operators: gt, gte, lt, lte, in)
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Campaign.find(JSON.parse(queryStr));

  // Selecting specific fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort({ updatedAt: -1 });
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // Execute query
  const campaigns = await query;
  res.status(200).json({
    success: true,
    count: campaigns.length,
    data: campaigns,
  });
});

// @Desc       Display single Campaign by ID or Slug
// @Route      GET /api/campaign/:id
// @Access     Public
exports.getCampaign = asyncHandler(async (req, res, next) => {
  let campaign;
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    campaign = await Campaign.findById(req.params.id);
  } else {
    campaign = await Campaign.findOne({ slug: req.params.id });
  }

  if (!campaign) {
    return next(new ErrorResponse(`Campaign not found!`, 404));
  }

  res.status(200).json({ success: true, data: campaign });
});

// @Desc       Create new Campaign
// @Route      POST /api/campaign
// @Access     Private
exports.postCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create(req.body);
  res.status(201).json({ success: true, data: campaign });
});

// @Desc       Update Campaign
// @Route      PUT /api/campaign/:id
// @Access     Private
exports.putCampaign = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let campaign = await Campaign.findById(id);

  if (!campaign) {
    return next(new ErrorResponse(`Campaign not found!`, 404));
  }

  campaign = await Campaign.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: campaign });
});

// @Desc       Delete Campaign
// @Route      DELETE /api/campaign/:id
// @Access     Private
exports.deleteCampaign = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await Campaign.findByIdAndDelete(id);
  res.status(200).json({ success: true, data: {} });
});
