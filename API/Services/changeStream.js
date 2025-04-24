const mongoose = require("mongoose");
const Campaign = require("../Models/Campaign");
const Notification = require("../Models/Notification");
const Transaction = require("../Models/Transaction");
require("colors");

module.exports = function setupChangeStreams(dbConnection) {
  console.log("🛠️ Initializing change stream...".yellow);
  console.log("Connection state:", dbConnection.readyState); // Should be 1

  const campaignCollection = dbConnection.collection("campaigns");
  console.log("Collection exists:", !!campaignCollection);

  const changeStream = campaignCollection.watch([], {
    fullDocument: "updateLookup",
  });

  console.log("Change stream initialized on campaigns collection".green);

  changeStream.on("change", async (change) => {
    console.log("🔵 Change detected:", JSON.stringify(change, null, 2));

    try {
      if (
        change.operationType === "update" &&
        change.updateDescription.updatedFields.status
      ) {
        const campaign = await Campaign.findById(change.documentKey._id);

        if (!campaign) {
          console.log("❌ Campaign not found for ID:", change.documentKey._id);
          return;
        }

        if (!campaign.userId) {
          console.log("❌ Campaign has no creator:", campaign._id);
          return;
        }
        const campaignId = campaign._id.toString();
        let message = "";
        if (change.updateDescription.updatedFields.status === "completed") {
          message = `Your campaign "${campaign.title}" has been completed!`;
        } else if (
          change.updateDescription.updatedFields.status === "approved"
        ) {
          message = `Your campaign "${campaign.title}" has been accepted!`;
        } else if (
          change.updateDescription.updatedFields.status === "rejected"
        ) {
          message = `Your campaign "${campaign.title}" has been rejected!`;
        } else if (
          change.updateDescription.updatedFields.status === "suspended"
        ) {
          message = `Your campaign "${campaign.title}" has been suspended!`;
          const reallocations = campaign.metadata?.reallocations || [];
          if (reallocations.length === 0) {
            console.log(
              "ℹ️ No reallocations found for campaign:".yellow,
              campaignId
            );
            return;
          }
          // Step 3: Build a map of reallocated campaigns
          const reallocatedCampaignIds = reallocations.map((r) =>
            r.reallocatedCampaignId.toString()
          );

          const reallocatedCampaignDetails = await Campaign.find(
            { _id: { $in: reallocatedCampaignIds } },
            { title: 1, category: 1 } // Fetch both title and category
          ).lean();

          const reallocatedCampaignMap = reallocatedCampaignDetails.reduce(
            (acc, c) => {
              acc[c._id.toString()] = { title: c.title, category: c.category };
              return acc;
            },
            {}
          );
          const transactions = await Transaction.find(
            { campaignId: campaignId },
            { userId: 1 } // Fetch only the `userId` field
          );

          // Extract unique user IDs
          const userIds = [
            ...new Set(transactions.map((t) => t.userId.toString())),
          ];
          // Construct the notification message with links to all reallocated campaigns
          const campaignLinks = reallocations
            .map((reallocation) => {
              const campaignId = reallocation.reallocatedCampaignId.toString();
              const campaign = reallocatedCampaignMap[campaignId];
              const amount = reallocation.reallocatedAmount;
              return `<a class="hover:underline text-sm" href="/category/${
                campaign.category
              }/${campaignId}">${campaign.title} (${amount.toFixed(
                2
              )} ETB)</a>`;
            })
            .join(", ");

          const notificationMessage = `
The campaign "${campaign.title}" has been suspended. 
Your contribution has been reallocated to the following campaign(s):
`;
          // Step 5: Send notifications to each user
          for (const userId of userIds) {
            await Notification.create({
              message: notificationMessage,
              link: campaignLinks,
              userId: userId,
              campaignId: campaignId,
              status: "suspended",
              notificationType: "reallocation",
            });
          }
        } else {
          return;
        }

        const notification = await Notification.create({
          userId: campaign.userId,
          campaignId: campaign._id,
          notificationType: "validation",
          message,
          status: change.updateDescription.updatedFields.status,
        });

        console.log(`✅ Notification created: ${notification._id}`.green);
      }
    } catch (err) {
      console.error("💥 Error processing change:".red, err.message);
    }
  });

  changeStream.on("error", (err) => {
    console.error("🔴 Change stream error:".red, err.message);
    // Auto-reconnect after 5 seconds
    setTimeout(() => setupChangeStreams(dbConnection), 5000);
  });
};
