const axios = require("axios");
const config = require("../config");

const subscriptionsEndpoint = config.orionUrl + "/v2/subscriptions";

module.exports = async function createGlobalSubscription() {
  const { data: subscriptions } = await axios.get(subscriptionsEndpoint);

  for (const subscription of subscriptions) {
    if (subscription.subject.entities[0].idPattern) {
      console.log("Global sub already exists");
      return;
    }
  }

  const payload = {
    description: "Notify for product availability",
    subject: {
      entities: [
        {
          idPattern: ".*",
          type: "Product",
        },
      ],
      condition: {
        attrs: ["available"],
      },
    },
    notification: {
      http: {
        url: "http://172.18.1.3:3001/api/notifications",
      },
      attrs: ["interestedUsers", "available"],
    },
  };

  await axios.post(subscriptionsEndpoint, payload);
};
