const axios = require("axios");
// const moment = require("moment/moment");
const config = require("../config");
const moment = require("moment-timezone");
const dssProductsEndpoint = config.apiUrl + "/products";
const entitiesEndpoint = config.orionUrl + "/v2/entities";
const suffix = "/attrs/currentDate/value";

function entityUpdateUrl(id) {
  return `${entitiesEndpoint}/${id}${suffix}`;
}

module.exports = function updateDate() {
  setInterval(() => {
    async function doUpdate() {
      console.log("Inside date updater");
      const { data: products } = await axios.get(dssProductsEndpoint);

      const currentDate = getCurrentDate();

      const options = {
        headers: {
          "Content-Type": "text/plain",
        },
      };
      for (const product of products) {
        await axios.put(entityUpdateUrl(product._id), currentDate, options);
      }
    }
    doUpdate();
  }, 60000);
};

// setInterval(() => {
//   getCurrentDate();
// }, 100000);

function getCurrentDate() {
  // let currentDate = new Date().toISOString();

  // currentDate = currentDate.split("T")[0];
  // currentDate =

  let currentDate = moment().tz("Europe/Athens").format();
  currentDate =
    currentDate.substr(0, 4) +
    currentDate.substr(5, 2) +
    currentDate.substr(8, 2);

  console.log(currentDate);

  return currentDate;
}
