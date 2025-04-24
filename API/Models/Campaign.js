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
      enum: [
        "pending",
        "active",
        "approved",
        "rejected",
        "completed",
        "suspended",
      ],
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
    releaseStatus: {
      type: String,
      enum: ["initial", "requested", "released", "rejected", "suspended"],
      default: "initial",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // donations: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Donation",
    //   },
    // ],

    image: [{ type: String }],
    video: [{ type: String }],
    document: [{ type: String }],
    link: [{ type: String }],

    createdAt: { type: Date, default: Date.now },
    metadata: {
      reallocations: {
        type: [
          {
            reallocatedCampaignId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Campaign", // Reference to the campaign where funds are reallocated
            },
            reallocatedAmount: { type: Number, required: true },
            reallocationDate: { type: Date, default: Date.now },
          },
        ],
        default: [], // Default to an empty array if no reallocations have occurred
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual to count donations
// campaignSchema.virtual("donationCount").get(function () {
//   return this.donations.length;
// });

// Pre-save hook to generate slug
campaignSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title.toLowerCase().replace(/ /g, "-");
  }
  next();
});
campaignSchema.methods.addReallocation = async function (allocations) {
  for (const [campaignId, amount] of Object.entries(allocations)) {
    this.metadata.reallocations.push({
      reallocatedCampaignId: campaignId,
      reallocatedAmount: amount,
      reallocationDate: new Date(),
    });
  }

  // Deduct the reallocated amount from the currentAmount
  this.raisedAmount = 0;
  this.status = "suspended";
  this.releaseStatus = "suspended";
  await this.save();
};
module.exports = mongoose.model("Campaign", campaignSchema);
