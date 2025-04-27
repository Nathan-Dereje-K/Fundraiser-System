const asyncHandler = require("../Middleware/async");
const axios = require("axios");
const crypto = require("crypto");
const braintree = require("braintree");
const { getUserFromToken, verifyToken } = require("../Utils/jwt");
const Campaign = require("../Models/Campaign");
const Transaction = require("../Models/Transaction");
const mongoose = require("mongoose");
const { ONE_DOLLAR_IN_ETHIOPIA_BIRR } = require("../constants");
const secret = process.env.CHAPA_SECRET_HASH;
const chapa_headers = {
  Authorization: "Bearer " + process.env.CHAPA_AUTH_KEY,
  "Content-Type": "application/json",
};
exports.initiatePayment = asyncHandler(async (req, res) => {
  const { campaignId, amount } = req.body;
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });
  const user = await getUserFromToken(token);
  let first_name, last_name, email, userId;
  if (user) {
    const { name: fullName, email: userEmail, _id } = user;
    [first_name, last_name] = fullName.split(" ");
    email = userEmail;
    userId = _id;
  } else {
    first_name = "Anonymous";
    last_name = "Donor";
    email = "anonymous@gmail.com";
    userId = new mongoose.Types.ObjectId("000000000000000000000000");
  }

  const tx_ref = first_name + "-" + Date.now();
  const campaign = await Campaign.findById(campaignId);

  const data = {
    tx_ref,
    amount,
    currency: "ETB",
    first_name,
    last_name,
    email,
    callback_url: "http://localhost:5000/api/donate/verifypayment",
    // return_url: `http://localhost:5173/category/${campaign.category}/${campaign._id}`,
  };

  try {
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      data,
      { headers: chapa_headers }
    );
    await Transaction.create({
      campaignId,
      userId,
      usersName: first_name + " " + last_name,
      amount,
      transaction_id: tx_ref,
    });
    res.json({ data: response.data, message: "Payment initiated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { trx_ref, status, _ } = req.query;

  const transaction = await Transaction.findOne({ transaction_id: trx_ref });
  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  if (status === "success" && transaction.status === "pending") {
    transaction.status = "approved";
    await transaction.save();

    const campaign = await Campaign.findById(transaction.campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    campaign.raisedAmount += transaction.amount;
    if (campaign.raisedAmount >= campaign.goalAmount) {
      campaign.status = "completed";
    }
    await campaign.save();
  }

  res.status(200).json({ message: "Payment confirmed" });
});

exports.webhookVerify = asyncHandler(async (req, res) => {
  const hash1 = crypto
    .createHmac("sha256", secret)
    .update(secret)
    .digest("hex");
  if (hash1 === req.headers["chapa-signature"]) {
    const { tx_ref, status, _ } = req.body;
    const transaction = await Transaction.findOne({ transaction_id: tx_ref });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    if (status === "success" && transaction.status === "pending") {
      transaction.status = "approved";
      await transaction.save();

      const campaign = await Campaign.findById(transaction.campaignId);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      campaign.raisedAmount += transaction.amount;
      if (campaign.raisedAmount >= campaign.goalAmount) {
        campaign.status = "completed";
      }
      await campaign.save();
    }
    res.status(200).json({ message: "Payment confirmed" });
  } else {
    res.status(500).json({ error: "Payment initialization failed" });
  }
});
exports.getTransactionStatusChapa = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findOne({ transaction_id: id });
  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  if (transaction.status === "pending") {
    try {
      const response = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${trx_ref}`,
        { headers: chapa_headers }
      );
      if (response.data.status === "success") {
        transaction.status = "approved";
        await transaction.save();
        const campaign = await Campaign.findById(transaction.campaignId);
        if (!campaign) {
          return res.status(404).json({ error: "Campaign not found" });
        }
        campaign.raisedAmount += transaction.amount;
        if (campaign.raisedAmount >= campaign.goalAmount) {
          campaign.status = "completed";
        }
        await campaign.save();
      }
    } catch (error) {}
  }
  res.status(200).json(transaction);
});
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, // Use Production for live
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
exports.initiateToken = asyncHandler(async (req, res) => {
  const clientToken = await gateway.clientToken.generate({});
  res.status(200).json({ clientToken });
});

exports.processPayment = asyncHandler(async (req, res) => {
  try {
    const { nonce, amount, campaignId } = req.body;
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ loggedIn: false });
    const user = verifyToken(token);
    let userId = user.userId;
    let usersName = "Anonymous Donor";
    if (userId === "_") {
      userId = new mongoose.Types.ObjectId("000000000000000000000000");
    } else {
      const myUser = await getUserFromToken(token);
      if (!myUser) {
        return next(new ErrorResponse(`User not found!`, 404));
      }
      usersName = myUser.name;
    }
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });
    const status = result.success ? "approved" : "rejected";
    await Transaction.create({
      campaignId,
      userId,
      amount,
      usersName,
      transaction_id: result.transaction.id,
      method: "international",
      status,
    });
    if (result.success) {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      campaign.raisedAmount += ONE_DOLLAR_IN_ETHIOPIA_BIRR * amount;
      if (campaign.raisedAmount >= campaign.goalAmount) {
        campaign.status = "completed";
      }
      await campaign.save();
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});
exports.getTransactionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const braintreeTransaction = await gateway.transaction.find(id);
  const transaction = await Transaction.findOne({ transaction_id: id });
  if (
    transaction.status === "pending" &&
    braintreeTransaction.status === "settled"
  ) {
    transaction.status = "approved";
    await transaction.save();
    const campaign = await Campaign.findById(transaction.campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    campaign.raisedAmount += ONE_DOLLAR_IN_ETHIOPIA_BIRR * transaction.amount;
    if (campaign.raisedAmount >= campaign.goalAmount) {
      campaign.status = "completed";
    }
    await campaign.save();
  }
  res.status(200).json(transaction);
});
//webhook braintree
exports.webhookBraintree = asyncHandler(async (req, res) => {
  const signature = req.headers["x-braintree-signature"];
  const payload = req.body;
  // console.log(req.body);
  // const event = await gateway.webhookNotification.parse(payload, signature);
  // console.log(event);
  // console.log(payload, signature);
  res.status(200).json({ message: "Payment confirmed" });
});
