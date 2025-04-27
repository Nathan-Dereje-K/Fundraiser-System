const asyncHandler = require("../Middleware/async");
const axios = require("axios");
const Campaign = require("../Models/Campaign");
const User = require("../Models/User");
const Transaction = require("../Models/Transaction");
const ErrorResponse = require("../Utils/errorResponse");
const mongoose = require("mongoose");
const { verifyToken } = require("../Utils/jwt");
const { OUR_PERCENT_PER_CAMPAIN } = require("../constants");
const secret = process.env.CHAPA_SECRET_HASH;
const chapa_headers = {
  Authorization: "Bearer " + process.env.CHAPA_AUTH_KEY,
  "Content-Type": "application/json",
};

// Release money
exports.releaseMoney = asyncHandler(async (req, res, next) => {
  try {
    const { id: campaignId } = req.params;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return next(new ErrorResponse(`Campaign not found!`, 404));
    }
    const user = await User.findById(campaign.userId);
    if (!user) {
      return next(new ErrorResponse(`User not found!`, 404));
    }
    user.releasedMoney +=
      (campaign.raisedAmount * (100 - OUR_PERCENT_PER_CAMPAIN)) / 100;
    await user.save();
    campaign.raisedAmount = 0;
    campaign.releaseStatus = "released";
    campaign.status = "completed";
    await campaign.save();
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    console.error("Release failed:", error);
  }
});

//suspend a campaign and reallocate it's money to other active campaigns
exports.suspendAndReallocate = asyncHandler(async (req, res, next) => {
  const { suspendedCampaignId, allocations } = req.body;
  const campaign = await Campaign.findById(suspendedCampaignId);
  if (!campaign) {
    return next(new ErrorResponse(`Campaign not found!`, 404));
  }
  const user = await User.findById(campaign.userId);
  if (!user) {
    return next(new ErrorResponse(`The user not found!`, 404));
  }
  user.blocked = true;
  await user.save();
  // Verify that all funds are allocated
  const totalAllocated = Object.values(allocations).reduce(
    (sum, amount) => sum + parseFloat(amount),
    0
  );

  if (Math.abs(totalAllocated - campaign.raisedAmount) > 0.01) {
    return next(
      new ErrorResponse(
        "All funds must be allocated to proceed with suspension",
        404
      )
    );
  }
  const userId = new mongoose.Types.ObjectId("000000000000000000000000");
  // 3. Reallocate funds to other campaigns
  for (const [campaignId, amount] of Object.entries(allocations)) {
    if (parseFloat(amount) <= 0) continue;

    // Update the target campaign
    const targetCampaign = await Campaign.findById(campaignId);
    if (!targetCampaign) {
      return next(
        new ErrorResponse(`Target campaign (ID: ${campaignId}) not found`, 404)
      );
    }

    targetCampaign.raisedAmount += parseFloat(amount);
    await targetCampaign.save();

    await Transaction.create({
      transaction_id: "anonymous" + Date.now(),
      campaignId: targetCampaign._id,
      userId,
      usersName: "Reallocation from " + campaign.title,
      amount: parseFloat(amount),
      transactionType: "reallocation",
      status: "approved",
      meta: {
        suspendedCampaignId: campaign._id,
        suspendedCampaignTitle: campaign.title,
        targetCampaignTitle: targetCampaign.title,
      },
    });
  }

  await campaign.addReallocation(allocations);
  res.status(200).json({ success: true, data: campaign });
});

//withdraw money using chapa
exports.withdrawMoney = asyncHandler(async (req, res) => {
  try {
    const { account_number, amount, bank_code } = req.body;
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ loggedIn: false });
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new ErrorResponse(`User not found!`, 404));
    }
    const userId = user._id;
    const usersName = user.name;
    const reference = user.name.split(" ")[0] + "_" + Date.now();
    const data = {
      account_name: usersName,
      account_number,
      amount,
      bank_code,
      reference,
    };
    const response = await axios.post(
      "https://api.chapa.co/v1/transfers",
      data,
      { headers: chapa_headers }
    );
    // console.log(response.data);
    if (response.data.status === "success") {
      await Transaction.create({
        userId,
        usersName,
        accountNumber: bank_code + "-" + account_number,
        amount,
        transactionType: "withdrawal",
        transaction_id: reference,
        status: "approved",
      });
      user.releasedMoney -= amount;
      await user.save();

      res.json({
        success: true,
        data: response.data,
        message: "Payment is successfull.",
      });
    } else {
      return next(new ErrorResponse(`Your money not withdrawn.`, 404));
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});
