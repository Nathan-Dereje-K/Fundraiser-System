const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL, {});
    console.log(
      `MongoDB Connected: ${mongoose.connection.host}`.cyan.bold.underline
    );
  } catch (error) {
    {
      console.error(
        "MongoDB Connection Error:",
        error.message.red.bold.underline
      );
      process.exit(1);
    }
  }
};
module.exports = connectDB;
