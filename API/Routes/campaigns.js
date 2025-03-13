const express = require("express");
const {
  getCampaigns,
  postCampaign,
  getCampaign,
  deleteCampaign,
} = require("../Controllers/campaign");
const router = express.Router();

router.route("/").get(getCampaigns).post(postCampaign);
router.route("/:id").put(getCampaign).delete(deleteCampaign);

module.exports = router;
