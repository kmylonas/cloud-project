const Joi = require('joi');
const jwt = require("jsonwebtoken");
const {itemSchema} = require("./item")
const { default: mongoose } = require('mongoose');


const cartSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [ itemSchema ]
  
})


const Cart = mongoose.model('Cart', cartSchema);


module.exports.Cart = Cart;




