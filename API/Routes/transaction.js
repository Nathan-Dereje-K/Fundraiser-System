const express = require("express");
const {
  getTrasactOfUserForCampaign,
  getTrasactOfUser,
} = require("../Controllers/transaction");
const router = express.Router();

router.route("/campaign/:id").get(getTrasactOfUserForCampaign);

router.route("/user/:id").get(getTrasactOfUser);

module.exports = router;
