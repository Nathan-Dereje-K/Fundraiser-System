const express = require("express");
const {
  getCampaigns,
  postCampaign,
  putCampaign,
  deleteCampaign,
  getCampaign,
} = require("../Controllers/campaign");
const router = express.Router();

router.route("/").get(getCampaigns).post(postCampaign);
router
  .route("/:idOrSlug")
  .get(getCampaign)
  .put(putCampaign)
  .delete(deleteCampaign);

module.exports = router;
