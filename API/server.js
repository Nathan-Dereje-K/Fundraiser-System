const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Here we go again!!");
});

app.listen(8000, () => {
  console.log("Server is on on port 8000");
});
