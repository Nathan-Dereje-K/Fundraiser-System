const express = require("express");
const {
  getCampaigns,
  postCampaign,
  putCampaign,
  deleteCampaign,
  getCampaign,
} = require("../Controllers/campaign");
const router = express.Router();

router.route("/").get(getCampaigns).post(upload.single("file"), postCampaign);
router.route("/:id").get(getCampaign).put(putCampaign).delete(deleteCampaign);

module.exports = router;
