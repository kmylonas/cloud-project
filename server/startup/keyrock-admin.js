const axios = require("axios");
const config = require("../config");

module.exports = async function (app) {
  const payload = {
    name: "admin@test.com",
    password: "1234",
  };

  const result = await axios.post(
    config.keyrockUrl + "/v1/auth/tokens",
    payload
  );

  global.token = result.headers["x-subject-token"];
};
