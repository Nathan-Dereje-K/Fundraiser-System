const express = require("express");
const { getTrasactOfUserForCampaign } = require("../Controllers/transaction");
const router = express.Router();

router.route("/campaign/:id").get(getTrasactOfUserForCampaign);

module.exports = router;
