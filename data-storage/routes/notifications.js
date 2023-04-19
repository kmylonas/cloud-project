const express = require("express");
const { Notification } = require("../models/notification");
const { Product } = require("../models/product");
const Router = express.Router();

Router.get("/:id", async (req, res) => {
  //find and return all notifications of user with userId = :id
  const userId = req.params.id;
  const notifications = await Notification.find({ userId: userId });
  //TODO: maybe populate the products before send back think about it!
  res.send(notifications);
});

Router.post("/date", async (req, res) => {
  const { interestedUsers, productId } = req.body;
  let notification;
  const product = await Product.findById(productId);
  const text = `The product ${product.name} has been withdrawn`;
  for (const userId of interestedUsers) {
    notification = new Notification({
      userId: userId,
      text: text,
    });
    await notification.save();
  }

  res.send("OK");
});

Router.post("/available", async (req, res) => {
  const { interestedUsers, productId, available } = req.body;
  let notification;
  const product = await Product.findById(productId);
  const text =
    available === 1
      ? `The product ${product.name} is now available`
      : `The product ${product.name} is exhausted.
      You will be notified when it is available again`;
  for (const userId of interestedUsers) {
    notification = new Notification({
      userId: userId,
      text: text,
    });
    await notification.save();
  }

  res.send("OK");
});

Router.delete("/:id", async (req, res) => {
  const notificationId = req.params.id;

  await Notification.findByIdAndDelete(notificationId);

  res.send("OK");
});

module.exports = Router;
