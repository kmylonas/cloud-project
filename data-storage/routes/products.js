const express = require("express");
const Router = express.Router();
const { Product } = require("../models/product");
const { Cart } = require("../models/cart");
const { Subscription } = require("../models/subscription");

Router.get("/", async (req, res) => {
  const products = await Product.find();

  res.send(products);
});

Router.get("/seller/:id", async (req, res) => {
  const sellerId = req.params.id;

  const products = await Product.find({ seller: sellerId })
    .select("-__v")
    .exec();

  res.send(products);
});

Router.post("/", async (req, res) => {
  const product = new Product({ ...req.body, activated: true });

  const result = await product.save();
  res.status(200).send(result);
});

Router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    let prod = await Product.findById(id);
    if (!prod) return res.status(404).send("Not found product with this ID");

    prod.name = req.body.name;
    prod.category = req.body.category;
    prod.code = req.body.code;
    prod.price = req.body.price;
    prod.dateofwithdrawal = req.body.dateofwithdrawal;

    const result = await prod.save();
    res.status(200).send(result);
  } catch (ex) {
    next(ex);
  }
});

Router.put("/activate/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const status = req.body.activated;

    const update = {
      activated: status,
    };
    await Product.findByIdAndUpdate(id, update);

    return res.send("OK");
  } catch (ex) {
    next(ex);
  }
});

Router.delete("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;

    const prod = await Product.findByIdAndDelete(productId);
    console.log(prod);
    if (!prod) return res.status(404).send("This product is already deleted");

    // update carts that are associated with the specific product
    await Cart.updateMany({ $pull: { items: { product: productId } } });

    res.send(prod);
  } catch (ex) {
    next(ex);
  }
});

Router.delete("/seller/:id", async (req, res, next) => {
  const sellerId = req.params.id;

  // const cursor = Product.find({ seller: sellerId }).cursor();
  // let allProductsId = [];
  // // before delete all products of this seller, make sure to remove them from all carts
  // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  //   await Cart.updateMany({ $pull: { items: { product: doc._id } } });
  //   //delete subscriptions from database
  //   // await Subscription.deleteOne({ productId: doc._id });
  //   //save all products of this seller in an array to return it
  //   allProductsId.push[doc._id];
  //   console.log(allProductsId);
  // }

  const sellerProducts = await Product.find({ seller: sellerId });
  let allProductsId = [];
  for (const product of sellerProducts) {
    await Cart.updateMany({ $pull: { items: { product: product._id } } });
    allProductsId.push(product._id);
  }

  await Product.deleteMany({ seller: sellerId });
  // console.log("All product ids:");
  // console.log(allProductsId);

  res.send(allProductsId);
});

module.exports = Router;
