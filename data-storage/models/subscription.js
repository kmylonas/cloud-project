const { default: mongoose } = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  productId: {
    type: String,
  },
  subscriptionId: {
    type: String,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports.Subscription = Subscription;
