const products = require("../routes/products");
const cart = require("../routes/cart");
const subscriptions = require("../routes/subscriptions");
const notifications = require("../routes/notifications");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/products", products);
  app.use("/api/cart", cart);
  app.use("/api/subscriptions", subscriptions);
  app.use("/api/notifications", notifications);
};
