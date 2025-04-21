const express = require("express");
const {
  getCampaigns,
  postCampaign,
  putCampaign,
  deleteCampaign,
  getCampaign,
  getActiveCampaigns,
} = require("../Controllers/campaign");
const { upload } = require("../Config/multerConfig");

const router = express.Router();

router
  .route("/")
  .get(getCampaigns)
  .post(
    upload.fields([
      { name: "image", maxCount: 5 },
      { name: "video", maxCount: 3 },
      { name: "document", maxCount: 5 },
    ]),
    postCampaign
  );

router
  .route("/:id")
  .get(getCampaign)
  .put(
    upload.fields([
      { name: "image", maxCount: 5 },
      { name: "video", maxCount: 3 },
      { name: "document", maxCount: 5 },
    ]),
    putCampaign
  )
  .delete(deleteCampaign);
router.route("/active/:id").get(getActiveCampaigns);

module.exports = router;
