require("dotenv").config();
const { sendEmail } = require("./mailer");

sendEmail({
  email: "ieyobworku@gmail.com",
  emailType: "RESET",
  userId: "61e4d4f7c9b4b1d1c0a5d2e3",
});
//i want to run from command line only this script
