const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());

setTimeout(() => {
  require("./startup/keyrock-admin")();
}, 35000);

setInterval(() => {
  console.log("Updating admin token");
  require("./startup/keyrock-admin")();
}, 600000);

require("./startup/routes")(app);
require("./startup/dateUpdater")();
require("./startup/globalSubscription")();

const dbUrl = process.env.DB_URL || "mongodb://localhost/cloud-app";

const options = {
  serverSelectionTimeoutMS: 3000,
};

mongoose
  .connect(dbUrl, options)
  .then(() => console.log("Connected to database"));

app.listen(3001, () => {
  console.log("Listening on 3001");
});
