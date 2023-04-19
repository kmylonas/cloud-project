const express = require("express");
const Router = express.Router();
const axios = require("axios");
const config = require("../config");
const { Product, validate } = require("../models/product");

const apiEndpoint = config.dssProxyUrl + "/products";
const usersEndpoint = config.keyrockUrl + "/v1/users";
const entitiesEndpoint = config.orionProxyUrl + "/v2/entities";
const subscriptionUrl = config.orionProxyUrl + "/v2/subscriptions";

function requestPath(toAppend) {
  return `${apiEndpoint}/${toAppend}`;
}

function requestUsersPath(id) {
  return `${usersEndpoint}/${id}`;
}

function entityUrl(id) {
  return `${entitiesEndpoint}/${id}/attrs/available/value`;
}

/* Forwards the request to the appropriate path of Data Storage Service */
Router.get("/", async (req, res, next) => {
  const sellerId = req.query.seller;
  let result;

  const oauthToken = req.headers["x-auth-token"];
  const options = getOptions();
  const dssOptions = getOrionOptions(oauthToken);

  try {
    if (sellerId) {
      result = await axios.get(requestPath(`seller/${sellerId}`), {
        params: {
          seller: sellerId,
        },
        headers: {
          "X-Auth-token": oauthToken,
        },
      });
    } else {
      result = await axios.get(apiEndpoint, dssOptions);
    }

    const products = result.data;

    for (const product of products) {
      let sellerId = product.seller;

      result = await axios.get(requestUsersPath(sellerId), options);

      product.seller = {
        firstname: result.data.user.username,
        lastname: result.data.user.description,
      };
    }

    res.send(products);
  } catch (ex) {
    console.log(ex);
    next();
  }
});

Router.post("/", async (req, res, next) => {
  //validate the body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const payload = { ...req.body };

    const oauthToken = req.headers["x-auth-token"];
    const options = getOrionOptions(oauthToken);
    const result = await axios.post(apiEndpoint, payload, options);

    await createProductEntity(result.data, oauthToken);
    await createSubscription(result.data, oauthToken);
    res.status(200).send(result.data._id);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

Router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const oauthToken = req.headers["x-auth-token"];
    const payload = { ...req.body };
    const options = getOrionOptions(oauthToken);
    const result = await axios.put(requestPath(id), payload, options);
    res.status(200).send(result.data);
  } catch (ex) {
    next(ex);
  }
});

Router.put("/activate/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const oauthToken = req.headers["x-auth-token"];
    const payload = { ...req.body };
    const options = getOrionOptions(oauthToken);
    await axios.put(requestPath(`/activate/${id}`), payload, options);

    const status = req.body.activated ? "1" : "0";
    await updateProductEntity(id, oauthToken, status);
    res.status(200);
  } catch (ex) {
    next(ex);
  }
});

Router.delete("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const oauthToken = req.headers["x-auth-token"];
    const options = getOrionOptions(oauthToken);
    const result = await axios.delete(requestPath(productId), options);

    await deleteProductEntity(productId, oauthToken);
    await deleteSubscription(productId, oauthToken);
    res.status(200).send(result.data);
  } catch (ex) {
    next(ex);
  }
});

/**************** USEFUL FUNCTIONS ********************/
/* 
  body for orion create entity 
{
    "id": "Product2",
    "type": "Product",
    "dateofwithdrawal": {
        "value": "2022-09-09T00:00:00.000Z",
        "type": "DateTime"
    }
}  */

async function updateProductEntity(productId, oauthToken, status) {
  const config = {
    headers: {
      "Content-Type": "text/plain",
      "X-Auth-token": oauthToken,
    },
  };
  console.log("INSIDE UPDATE PRODUCT ENTITY");
  console.log("INSIDE UPDATE PRODUCT ENTITY");
  console.log("INSIDE UPDATE PRODUCT ENTITY");
  console.log("INSIDE UPDATE PRODUCT ENTITY");
  try {
    await axios.put(entityUrl(productId), status, config);
  } catch (error) {
    console.log(error);
  }
}

async function createProductEntity(product, oauthToken) {
  const payload = {
    id: product._id,
    type: "Product",
    interestedUsers: {
      value: [],
      type: "StructuredValue",
    },
    currentDate: {
      value: getCurrentDate(),
      type: "Integer",
    },
    available: {
      value: 1,
      type: "Integer",
    },
  };
  const options = getOrionOptions(oauthToken);

  await axios.post(entitiesEndpoint, payload, options);
}

//create subscription for each product
async function createSubscription(product, oauthToken) {
  const dateOfWithdrawal = formatDate(product.dateofwithdrawal);
  const options = getOrionOptions(oauthToken);

  const payload = {
    description: "Notify for product withdrawn",
    subject: {
      entities: [
        {
          id: product._id,
          type: "Product",
        },
      ],
      condition: {
        attrs: ["currentDate"],
        expression: {
          q: `currentDate>${dateOfWithdrawal}`, //dont forget to format it
        },
      },
    },
    notification: {
      http: {
        url: "http://172.18.1.3:3001/api/notifications",
      },
      attrs: ["interestedUsers"],
    },
  };

  await axios.post(subscriptionUrl, payload, options);
  const { data: allSubscriptions } = await axios.get(subscriptionUrl, options);
  const { id: subscriptionId } = allSubscriptions.find(
    (sub) => sub.subject.entities[0].id === product._id
  );
  // const subscriptionId = getSubscriptionId(headers);

  const subscription = {
    productId: product._id,
    subscriptionId: subscriptionId,
  };
  await axios.post(`${config.apiUrl}/subscriptions`, subscription);
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

function getCurrentDate() {
  let currentDate = new Date();
  currentDate = currentDate.toISOString().split("T")[0];
  currentDate = formatDate(currentDate);

  return currentDate;
}

function formatDate(date) {
  const formattedDate = (date =
    date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2));

  return formattedDate;
}

function getOptions() {
  return {
    headers: {
      "X-Auth-token": token,
    },
  };
}

function getOrionOptions(oauthToken) {
  return {
    headers: {
      "X-Auth-token": oauthToken,
    },
  };
}

module.exports = Router;
