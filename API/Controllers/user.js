const User = require("../Models/User");

exports.handleClerkWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "user.created") {
      const { id, email_addresses, first_name, last_name } = data;

      const existingUser = await User.findOne({ clerkId: id });
      if (!existingUser) {
        await User.create({
          clerkId: id,
          email: email_addresses[0]?.email_address,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
        });
      }
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
