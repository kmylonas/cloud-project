const { default: mongoose } = require("mongoose");

const notificationSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  text: {
    type: String,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports.Notification = Notification;
