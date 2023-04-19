const express = require("express");
const Router = express.Router();
const axios = require("axios");
const config = require("../config");

const apiEndpoint = config.apiUrl + "/notifications";

Router.get("/:id", async (req, res) => {
  //forward get request to data storage
  //only send data field of notifications payload receievd from orion
  //return the notifications for this user

  const userId = req.params.id;
  const oauthToken = req.headers["x-auth-token"];

  const { data } = await axios.get(
    `${apiEndpoint}/${userId}`,
    getOrionOptions(oauthToken)
  );
  res.send(data);
});

Router.post("/", async (req, res) => {
  const oauthToken = req.headers["x-auth-token"];

  let payload = {};
  console.log(req.body);
  if (!req.body.data[0].available) {
    payload = {
      interestedUsers: req.body.data[0].interestedUsers.value,
      productId: req.body.data[0].id,
    };
    await axios.post(
      `${apiEndpoint}/date`,
      payload,
      getOrionOptions(oauthToken)
    );
  } else if (req.body.data[0].available) {
    payload = {
      interestedUsers: req.body.data[0].interestedUsers.value,
      productId: req.body.data[0].id,
      available: req.body.data[0].available.value,
    };
    await axios.post(
      `${apiEndpoint}/available`,
      payload,
      getOrionOptions(oauthToken)
    );
  }

  res.send("OK");
});

Router.delete("/:id", async (req, res) => {
  const oauthToken = req.headers["x-auth-token"];
  const notificationId = req.params.id;

  await axios.delete(
    `${apiEndpoint}/${notificationId}`,
    getOrionOptions(oauthToken)
  );
  res.send("OK");
});

function getOrionOptions(oauthToken) {
  return {
    headers: {
      "X-Auth-token": oauthToken,
    },
  };
}

module.exports = Router;
