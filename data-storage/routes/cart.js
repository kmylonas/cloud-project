const express = require("express");
const { Cart } = require("../models/cart");
const { Item } = require("../models/item");
const { Product } = require("../models/product");
const Router = express.Router();

/* Return the cart of the user with :id */
Router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("Got here");
  const result = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
  });

  res.send(result);
});

Router.post("/:id", async (req, res, next) => {
  const userId = req.params.id;

  const cart = new Cart({
    user: userId,
  });

  //respond
  const result = await cart.save();
  console.log(result);
  res.status(200).send(result);
});

Router.put("/add/:id", async (req, res, next) => {
  const productId = req.body.product;
  const userId = req.params.id;
  const cart = await Cart.findOne({ user: userId });

  let item = cart.items.find((item) => item.product.toString() === productId);
  if (item) item.quantity++;
  else {
    item = createItem(productId);
    cart.items.push(item);
  }
  const result = await cart.save();
  return res.status(200).send(result);
});

Router.put("/remove/:id", async (req, res, next) => {
  const productId = req.body.product;
  const userId = req.params.id;

  const cart = await Cart.findOne({ user: userId });
  let item = cart.items.find((item) => item.product.toString() === productId);

  const payload = {
    quantity: item.quantity,
  };

  if (item.quantity > 1) item.quantity--;
  else if (item.quantity === 1)
    cart.items = cart.items.filter((item) => item.product != productId);

  const result = await cart.save();

  return res.status(200).send(payload);
});

Router.put("/clear/:id", async (req, res, next) => {
  const userId = req.params.id;
  const cart = await Cart.findOne({ user: userId });
  const cartItems = cart.items;
  cart.items = [];
  await cart.save();
  return res.status(200).send({ items: cartItems });
});

Router.delete("/:id", async (req, res) => {
  console.log("Got here");
  const userId = req.params.id;
  const deleteCount = await Cart.deleteOne({ user: userId });
  return res.send(deleteCount);
});

/* HELPER FUNCTIONS */

function createItem(productId) {
  return new Item({
    product: productId,
    quantity: 1,
    dateAdded: new Date(),
  });
}

module.exports = Router;
