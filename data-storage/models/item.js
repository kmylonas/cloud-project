// const Joi = require('joi');
// const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const itemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
  },
  dateAdded: {
    type: Date,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports.Item = Item;
module.exports.itemSchema = itemSchema;
