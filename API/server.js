const express = require("express");
const app = express();
const dotenv = require("dotenv");

const campaignRouter = require("./Routes/campaigns");
const cors = require("cors");

require("colors");

dotenv.config({ path: "./Config/config.env" });

// Connect to MongoDB
const connectDB = require("./Config/db");
const morgan = require("morgan");
const errorHandler = require("./Middleware/error");

connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/campaigns", campaignRouter);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is live on port ${port}`.cyan);
});
