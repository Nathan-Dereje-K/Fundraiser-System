const Testimonial = require("../Models/Testimonial");
const Campaign = require("../Models/Campaign");
const ErrorResponse = require("../Utils/errorResponse");

const createTestimonial = async (req, res, next) => {
  try {
    const { message, userName } = req.body;
    const userId = req.user.id;

    const campaign = await Campaign.find({
      userId: userId,
      status: "completed",
    });
    if (campaign.length === 0) {
      return next(
        new ErrorResponse(`You have no campaign which is completed!`, 404)
      );
    }

    let imageUrl = null;

    if (req.files?.image?.length) {
      imageUrl = req.files.image[0].path;
    }

    const testimonial = await Testimonial.create({
      userId,
      userName,
      message,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully",
      testimonial,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const getAllTestimonials = async (req, res) => {
  try {
    const testimonial = await Testimonial.find().sort({ createdAt: -1 });

    const count = testimonial.length;

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "No testimonial found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonials retrieved successfully",
      count,
      data: testimonial,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// delete a Testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial,
};
