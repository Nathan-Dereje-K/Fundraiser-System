const express = require("express");
const {
  getCampaigns,
  getMyCampaigns,
  postCampaign,
  putCampaign,
  deleteCampaign,
  getCampaign,
  getActiveCampaigns,
  searchCampaigns,
} = require("../Controllers/campaign");
const { upload } = require("../Config/multerConfig");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getMyCampaigns);

router
  .route("/")
  .get(getCampaigns)
  .post(
    authMiddleware,
    upload.fields([
      { name: "image", maxCount: 5 },
      { name: "video", maxCount: 3 },
      { name: "document", maxCount: 5 },
    ]),
    postCampaign
  );
router.route("/search").get(searchCampaigns);

router
  .route("/:id")
  .get(getCampaign)
  .put(
    authMiddleware,
    upload.fields([
      { name: "image", maxCount: 5 },
      { name: "video", maxCount: 3 },
      { name: "document", maxCount: 5 },
    ]),
    putCampaign
  )
  .delete(authMiddleware, deleteCampaign);
router.route("/active/:id").get(getActiveCampaigns);

module.exports = router;
