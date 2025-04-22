require("dotenv").config({ path: "./Config/config.env" });
const express = require("express");
const app = express();
const campaignRouter = require("./Routes/campaigns");
const authRouter = require("./Routes/auth");
const userRouter = require("./Routes/user");
const utilRouter = require("./Routes/util");
const donateRouter = require("./Routes/donate");
const transactionRouter = require("./Routes/transaction");
const reportRouter = require("./Routes/report");

const cookieParser = require("cookie-parser");
const cors = require("cors");

require("colors");

// Connect to MongoDB
const connectDB = require("./Config/db");
const morgan = require("morgan");
const errorHandler = require("./Middleware/error");

connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow React frontend

// Routes
app.use("/api/campaigns", campaignRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/util", utilRouter);
app.use("/api/donate", donateRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/reports", reportRouter);

app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is live on port ${port}`.cyan);
});
