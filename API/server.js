const express = require("express");
const app = express();
const campaignRouter = require("./Routes/campaigns");

require("dotenv").config();
require("colors");
const cors = require("cors");

// Connect to MongoDB
const connectDB = require("./Config/db");
const morgan = require("morgan");
const errorHandler = require("./Middleware/error");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/campaigns", campaignRouter);

app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is live on port ${port}`.cyan);
});
