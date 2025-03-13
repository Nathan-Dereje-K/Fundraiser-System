const express = require("express");
const { handleClerkWebhook } = require("../Controllers/user");

const router = express.Router();

router.post("/clerk-webhook", handleClerkWebhook);

module.exports = router;
