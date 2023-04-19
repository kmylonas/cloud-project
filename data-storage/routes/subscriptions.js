const express = require("express");
const { Subscription } = require("../models/subscription");
const Router = express.Router();

Router.post("/", async (req, res) => {
  const subscription = new Subscription({
    productId: req.body.productId,
    subscriptionId: req.body.subscriptionId,
  });

  await subscription.save();

  res.send("OK");
});

Router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  const result = await Subscription.findOneAndDelete({ productId: productId });
  res.send(result);
});

module.exports = Router;
