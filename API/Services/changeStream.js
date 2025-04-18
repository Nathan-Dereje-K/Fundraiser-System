const Campaign = require("../Models/Campaign");
const Notification = require("../Models/Notification");
require('colors');

module.exports = function setupChangeStreams(dbConnection) {
  console.log("🛠️ Initializing change stream...".yellow);
  console.log("Connection state:", dbConnection.readyState); // Should be 1

  const campaignCollection = dbConnection.collection('campaigns');
  console.log("Collection exists:", !!campaignCollection);

  const changeStream = campaignCollection.watch([], {
    fullDocument: 'updateLookup'
  });

  console.log("Change stream initialized on campaigns collection".green);

  changeStream.on('change', async (change) => {
    console.log("🔵 Change detected:", JSON.stringify(change, null, 2));
    
    try {
      if (change.operationType === 'update' && change.updateDescription.updatedFields.status) {
        const campaign = await Campaign.findById(change.documentKey._id);
        
        if (!campaign) {
          console.log("❌ Campaign not found for ID:", change.documentKey._id);
          return;
        }
        
        if (!campaign.creator) {
          console.log("❌ Campaign has no creator:", campaign._id);
          return;
        }

        const notification = await Notification.create({
          userId: campaign.creator,
          campaignId: campaign._id,
          notificationType: 'validation',
          message: `Your campaign "${campaign.title}" status changed to ${change.updateDescription.updatedFields.status}`,
          status: change.updateDescription.updatedFields.status,
          read: false
        });

        console.log(`✅ Notification created: ${notification._id}`.green);
      }
    } catch (err) {
      console.error("💥 Error processing change:".red, err.message);
    }
  });

  changeStream.on('error', (err) => {
    console.error("🔴 Change stream error:".red, err.message);
    // Auto-reconnect after 5 seconds
    setTimeout(() => setupChangeStreams(dbConnection), 5000);
  });
};