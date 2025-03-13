const express = require("express");
const {
  getCampaigns,
  postCampaign,
  getCampaign,
  putCampaign,
  deleteCampaign,
} = require("../Controllers/campaign");
const router = express.Router();

router.route("/").get(getCampaigns).post(postCampaign);
router.route("/:id").get(getCampaign).put(putCampaign).delete(deleteCampaign);

module.exports = router;
