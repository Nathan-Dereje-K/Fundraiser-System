const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please add a campaign description"],
      trim: true,
    },
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
      min: [1, "Goal amount must be greater than zero"],
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: [0, "Raised amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "approved", "rejected", "completed"],
      default: "pending",
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    reported: {
      type: Boolean,
      default: false,
    },
    // creator: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // validators: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    // donations: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Donation",
    //   },
    // ],
    image: [{ type: String }],
    video: [{ type: String }],
    link: [{ type: String }],

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual to count donations
// campaignSchema.virtual("donationCount").get(function () {
//   return this.donations.length;
// });

// Pre-save hook to generate slug
campaignSchema.pre("save", function (next) {
  this.slug = this.title.toLowerCase().replace(/ /g, "-");
  next();
});

module.exports = mongoose.model("Campaign", campaignSchema);
