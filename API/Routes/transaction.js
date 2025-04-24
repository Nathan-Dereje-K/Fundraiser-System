const express = require("express");
const {
  getTrasactOfUserForCampaign,
  getTrasactOfUser,
  getTrasactOfCampaign,
} = require("../Controllers/transaction");
const router = express.Router();

router.route("/campaign/user/:id").get(getTrasactOfUserForCampaign);

router.route("/campaign/:id").get(getTrasactOfCampaign);

router.route("/user/:id").get(getTrasactOfUser);

module.exports = router;
