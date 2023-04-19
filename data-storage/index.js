const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());

require("./startup/routes")(app);

const dbUrl = process.env.DB_URL || "mongodb://localhost/cloud-app";

const options = {
  serverSelectionTimeoutMS: 3000,
};

mongoose
  .connect(dbUrl, options)
  .then(() => console.log("Connected to database"));

app.listen(27018, () => {
  console.log("Listening on 27018");
});
