const Report = require("../Models/Report");

// Create a new report
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

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "name")
      .populate("campaignId", "title") // Populate the reportedBy field with the user's email
      .sort({ createdAt: -1 });

    const count = reports.length;

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      count,
      data: reports,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// delete a report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  createReport,
  getAllReports,
  deleteReport,
};
