const asyncHandler = require("../Middleware/async");
const ErrorResponse = require("../Utils/errorResponse");
const Campaign = require("../Models/Campaign");

// @Desc       Get all Campaigns
// @Route      GET /api/campaigns
// @Access     Public
exports.getCampaigns = asyncHandler(async (req, res) => {
  let query;
  const reqQuery = { ...req.query };

  // Remove fields that are not for filtering
  ["sort", "select", "page", "limit"].forEach(
    (param) => delete reqQuery[param]
  );

  // Convert MongoDB operators to $gt, $lt, etc.
  let queryStr = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Campaign.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    query = query.select(req.query.select.split(",").join(" "));
  }

  // Sorting
  query = req.query.sort
    ? query.sort(req.query.sort.split(",").join(" "))
    : query.sort({ updatedAt: -1 });

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // Execute query
  const campaigns = await query;
  res
    .status(200)
    .json({ success: true, count: campaigns.length, data: campaigns });
});

// @Desc       Get Single Campaign by ID or Slug
// @Route      GET /api/campaign/:id
// @Access     Public
exports.getCampaign = asyncHandler(async (req, res, next) => {
  let campaign = await Campaign.findOne({
    $or: [
      { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      { slug: req.params.id },
    ],
  });

  if (!campaign) {
    return next(new ErrorResponse(`Campaign not found!`, 404));
  }

  res.status(200).json({ success: true, data: campaign });
});

// @Desc       Create New Campaign
// @Route      POST /api/campaign
// @Access     Private
exports.postCampaign = asyncHandler(async (req, res) => {
  const { title, description, goalAmount, category, link } = req.body;

  const imageUrls = req.files?.image?.map((file) => file.path) || [];
  const videoUrls = req.files?.video?.map((file) => file.path) || [];
  const documentUrls = req.files?.document?.map((file) => file.path) || [];
  const linkArray = Array.isArray(link) ? link : link ? [link] : [];

  const campaign = await Campaign.create({
    title,
    description,
    goalAmount,
    category,
    startDate,
    endDate,
    image: imageUrls,
    video: videoUrls,
    document: documentUrls,
    link: linkArray,
  });

  res.status(201).json({ success: true, data: campaign });
});

// @Desc       Update Campaign
// @Route      PUT /api/campaign/:id
// @Access     Private
exports.putCampaign = asyncHandler(async (req, res, next) => {
  const imageUrls = (req.files?.image || []).map((file) => file.path);
  const videoUrls = (req.files?.video || []).map((file) => file.path);
  const documentUrls = (req.files?.document || []).map((file) => file.path);
  const linkArray = Array.isArray(req.body.link)
    ? req.body.link
    : req.body.link
    ? [req.body.link]
    : [];

  const updatedData = { ...req.body };

  if (imageUrls.length > 0) updatedData.image = imageUrls;
  if (videoUrls.length > 0) updatedData.video = videoUrls;
  if (documentUrls.length > 0) updatedData.document = documentUrls;
  if (req.body.link !== undefined) updatedData.link = linkArray;

  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true, runValidators: true }
  );

  if (!campaign) {
    return next(new ErrorResponse(`Campaign not found!`, 404));
  }

  res.status(200).json({ success: true, data: campaign });
});

// @Desc       Delete Campaign
// @Route      DELETE /api/campaign/:id
// @Access     Private
exports.deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findByIdAndDelete(req.params.id);

  if (!campaign) {
    return next(new ErrorResponse(`Campaign not found!`, 404));
  }

  res.status(200).json({ success: true, data: {} });
});
