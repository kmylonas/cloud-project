const Joi = require("joi");

const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateofwithdrawal: {
    type: Date,
  },
  activated: {
    type: Boolean,
  },
});

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    seller: Joi.string().required(),
    code: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    dateofwithdrawal: Joi.string(),
  });

  return schema.validate(product);
}

const Product = mongoose.model("Product", productSchema);

module.exports.Product = Product;
module.exports.validate = validateProduct;
