const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "seller", "user"],
    required: true,
  },
  status: {
    type: String,
    enum: ["approved", "unapproved"],
    required: true,
  },
});

userSchema.methods.generateAuthToken = function (user) {
  const privateKey = "imthekey";
  const token = jwt.sign(
    {
      _id: id,
      firstname: this.firstname,
      lastname: this.lastname,
      role: this.role,
      status: this.status,
      cart: this.cart,
    },
    privateKey
  );
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().required(),
    role: Joi.string().valid("admin", "seller", "user"),
    status: Joi.string().valid("approved", "unapproved"),
  });

  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.validate = validateUser;
