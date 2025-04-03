const asyncHandler = require("../Middleware/async");
const Transaction = require("../Models/Transaction");
const { verifyToken } = require("../Utils/jwt");

//get transactions for specific user which he donote for specific campaign
exports.getTrasactOfUserForCampaign = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = verifyToken(req.cookies.token);
  if (user.userId === "_") return res.json([]);

  const transactions = await Transaction.find({
    campaignId: id,
    userId: user.userId,
  });
  res.json(transactions);
});
