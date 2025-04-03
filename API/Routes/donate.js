const express = require("express");
const {
  initiatePayment,
  verifyPayment,
  webhookVerify,
  initiateToken,
  processPayment,
  getTransactionStatus,
  webhookBraintree,
  getTransactionStatusChapa,
} = require("../Controllers/donate");
const router = express.Router();

router.route("/initiatepayment").post(initiatePayment);

router.route("/verifypayment").get(verifyPayment);

router.route("/webhook").post(webhookVerify);

router.route("/initiatetoken").get(initiateToken);

router.route("/processpayment").post(processPayment);

router.route("/gettransactionstatus/:id").get(getTransactionStatus);

router.route("/gettransactionstatuschapa/:id").get(getTransactionStatusChapa);

router.route("/webhookbraintree").post(webhookBraintree);

module.exports = router;
