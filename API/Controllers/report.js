const Report = require("../Models/Report");

const createReport = async (req, res) => {
  try {
    const { campaignId, reason } = req.body;
    const userId = req.user.id;

    let imageUrl = null;
    let videoUrl = null;

    if (req.files?.image?.length) {
      imageUrl = req.files.image[0].path;
    }

    if (req.files?.video?.length) {
      videoUrl = req.files.video[0].path;
    }

    const report = await Report.create({
      campaignId,
      reportedBy: userId,
      reason,
      imageUrl,
      videoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  createReport,
};
