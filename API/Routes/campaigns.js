const express = require("express");
const { getCampaigns } = require("../Controllers/campaign");
const router = express.Router();

router.route("/").get(getCampaigns);

module.exports = router;
