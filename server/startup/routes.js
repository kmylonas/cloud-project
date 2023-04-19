const users = require("../routes/users");
const login = require("../routes/login");
const products = require("../routes/products");
const cart = require("../routes/cart");
const error = require("../middleware/error");
const notifications = require("../routes/notifications");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use("/api/products", products);
  app.use("/api/cart", cart);
  app.use("/api/notifications", notifications);

  app.use(error);
};
