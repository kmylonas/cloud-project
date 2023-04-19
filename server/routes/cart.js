const express = require("express");
const { Cart } = require("../models/cart");
const { Item } = require("../models/item");
const { Product } = require("../models/product");
const Router = express.Router();
const config = require("../config");
const axios = require("axios");

const apiEndpoint = config.apiUrl + "/cart";
const entitiesUrl = config.orionProxyUrl + "/v2/entities";
// const subscriptionUrl = config.orionUrl + "/v2/subscriptions";

function requestPath(toAppend) {
  return `${apiEndpoint}/${toAppend}`;
}

/* Return the cart of the user with :id */
Router.get("/:id", async (req, res, next) => {
  try {
    const oauthToken = req.headers["x-auth-token"];
    const userId = req.params.id;

    const result = await axios.get(
      requestPath(userId),
      getOrionOptions(oauthToken)
    );
    res.status(200).send(result.data);
  } catch (ex) {
    next(ex);
  }
});

/* Create a cart for the user with :id */
Router.post("/:id", async (req, res, next) => {
  try {
    const oauthToken = req.headers["x-auth-token"];
    const userId = req.params.id;
    // const cart = new Cart({
    //   user: userId,
    // });
    // //respond
    // const result = await cart.save();
    // res.status(200).send(result);
    const result = await axios.post(
      requestPath(userId),
      getOrionOptions(oauthToken)
    );
    res.status(200).send(result.data);
  } catch (ex) {
    next(ex);
  }
});

/* Add or remove a product from cart of user with :id
    Depends on query parameter action.
     If add -> add
     If remove -> remove 
     */
Router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.query.action;
    const productId = req.body.product;
    const oauthToken = req.headers["x-auth-token"];

    const path = requestPath(`${action}/${userId}`);
    const { data } = await axios.put(
      path,
      { product: productId },
      getOrionOptions(oauthToken)
    );
    // console.log(quantity);
    if (action === "add") {
      //push user into intrested users
      subscribeUserToProduct(productId, userId, oauthToken);
    } else if (action === "remove") {
      //remove user from intrested users of specific product
      unsubscribeUserFromProduct(productId, userId, data.quantity, oauthToken);
    } else if (action === "clear") {
      unsubscribeUserFromAllProducts(userId, data.items, oauthToken);
    }

    res.status(200).send("OK");
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

async function subscribeUserToProduct(productId, userId, oauthToken) {
  const options = getOrionOptions(oauthToken);
  const { data: entity } = await axios.get(
    `${entitiesUrl}/${productId}`,
    options
  );
  const intUsers = entity.interestedUsers.value;
  if (intUsers.includes(userId)) return;
  const payload = {
    interestedUsers: {
      value: [...intUsers, userId],
      type: "StructuredValue",
    },
  };
  await axios.patch(`${entitiesUrl}/${productId}/attrs`, payload, options);
}

async function unsubscribeUserFromProduct(
  productId,
  userId,
  quantity,
  oauthToken
) {
  const options = getOrionOptions(oauthToken);
  if (quantity != 1) return;
  const { data: entity } = await axios.get(
    `${entitiesUrl}/${productId}`,
    options
  );
  let intUsers = entity.interestedUsers.value;
  intUsers = intUsers.filter((user) => user != userId);
  const payload = {
    interestedUsers: {
      value: [...intUsers],
      type: "StructuredValue",
    },
  };
  await axios.patch(`${entitiesUrl}/${productId}/attrs`, payload, options);
}

async function unsubscribeUserFromAllProducts(userId, cartItems, oauthToken) {
  //ask from datastorage for users cart
  const options = getOrionOptions(oauthToken);
  let products = [];
  let payload;
  for (const item of cartItems) {
    payload = {
      value: { $pull: userId },
      type: "StructuredValue",
    };
    await axios.put(
      `${entitiesUrl}/${item.product}/attrs/interestedUsers`,
      payload,
      options
    );
  }
  //see his products
  //unsubscribe him
}

/* Delete his cart in case a user with :id is deleted */
Router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const oauthToken = req.headers["x-auth-token"];
    // const cart = Cart.findOneAndDelete({ user: userId });
    // return res.send(cart);
    const result = await axios.delete(
      requestPath(userId),
      getOrionOptions(oauthToken)
    );
  } catch (ex) {
    next(ex);
  }
});

function getOrionOptions(oauthToken) {
  return {
    headers: {
      "X-Auth-token": oauthToken,
    },
  };
}

module.exports = Router;
