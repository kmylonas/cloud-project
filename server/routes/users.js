const express = require("express");
const { Cart } = require("../models/cart");
const Router = express.Router();
const { User, validate } = require("../models/user");
const { Products, Product } = require("../models/product");
const axios = require("axios");
const config = require("../config");

const apiEndpoint = config.keyrockUrl + "/v1/users";
const cartEndpoint = config.apiUrl + "/cart";
const productsEndpoint = config.apiUrl + "/products";
const entitiesEndpoint = config.orionProxyUrl + "/v2/entities";
const subscriptionUrl = config.orionProxyUrl + "/v2/subscriptions";

function requestPath(toAppend) {
  return `${apiEndpoint}/${toAppend}`;
}

function requestCartPath(toAppend) {
  return `${cartEndpoint}/${toAppend}`;
}

function requestProductsPath(toAppend) {
  return `${productsEndpoint}/${toAppend}`;
}

Router.get("/", async (req, res, next) => {
  const options = getOptions();

  const result = await axios.get(apiEndpoint, options);
  const userIds = result.data.users.map((user) => {
    return user.id;
  });

  let myUsers = [];

  for (const id of userIds) {
    let user = await getUserInfo(id, options);
    myUsers.push(user);
  }

  myUsers = myUsers.map(convertUser);
  myUsers = myUsers.filter((user) => user.email != "admin@test.com");

  res.send(myUsers);
});

async function getUserInfo(id, options) {
  const result = await axios.get(requestPath(id), options);
  const user = result.data.user;
  return user;
}

Router.post("/", async (req, res, next) => {
  const options = getOptions();
  const oauthToken = req.headers["x-auth-token"];
  let payload = {
    user: {
      username: req.body.firstname,
      description: req.body.lastname,
      email: req.body.email,
      website: req.body.role,
      password: req.body.password,
      extra: "unapproved",
    },
  };

  const result = await axios.post(apiEndpoint, payload, options);

  const newUserId = result.data.user.id;

  if (req.body.role === "user") {
    await axios.post(requestCartPath(newUserId), getOrionOptions(oauthToken));
  }

  res.status(200).send(result.data);
});

Router.put("/", async (req, res, next) => {
  const options = getOptions();

  const userId = req.body._id;
  const payload = {
    user: {
      username: req.body.firstname,
      description: req.body.lastname,
      email: req.body.email,
      website: req.body.role,
      extra: req.body.status,
    },
  };

  const result = await axios.patch(requestPath(userId), payload, options);
  res.send(result.data);
});

Router.delete("/:id", async (req, res, next) => {
  const options = getOptions();
  const userId = req.params.id;
  const oauthToken = req.headers["x-auth-token"];
  const result = await axios.get(requestPath(userId), options);

  const role = result.data.user.website;

  // delete user from keyrock
  await axios.delete(requestPath(userId), options);

  if (role === "user") {
    // delete users cart
    await axios.delete(requestCartPath(userId), getOrionOptions(oauthToken));
  } else if (role === "seller") {
    // delete sellers products
    const { data: allProductsId } = await axios.delete(
      requestProductsPath(`seller/${userId}`),
      getOrionOptions(oauthToken)
    );

    for (const productId of allProductsId) {
      //delete entity
      await deleteProductEntity(productId, oauthToken);
      //delete subscription
      await deleteSubscription(productId, oauthToken);
    }
  }
  return res.send(result.data).status(200);
});

/* Useful functions */
function convertUser(keyrockUser) {
  const myUser = {
    _id: keyrockUser.id,
    firstname: keyrockUser.username,
    lastname: keyrockUser.description,
    email: keyrockUser.email,
    role: keyrockUser.website,
    status: keyrockUser.extra,
  };
  return myUser;
}

function getOptions() {
  return {
    headers: {
      "X-Auth-token": token,
    },
  };
}

async function deleteProductEntity(productId, oauthToken) {
  const options = getOrionOptions(oauthToken);
  await axios.delete(`${entitiesEndpoint}/${productId}`, options);
}

async function deleteSubscription(productId, oauthToken) {
  const options = getOrionOptions(oauthToken);
  const { data } = await axios.delete(
    `${config.apiUrl}/subscriptions/${productId}`
  );
  const { subscriptionId } = data;
  await axios.delete(`${subscriptionUrl}/${subscriptionId}`, options);
}

function getOrionOptions(oauthToken) {
  return {
    headers: {
      "X-Auth-token": oauthToken,
    },
  };
}

module.exports = Router;
