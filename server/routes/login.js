const express = require("express");
const Joi = require("joi");
const Router = express.Router();
const { User } = require("../models/user");
const config = require("../config");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const apiEndpoint = config.keyrockUrl + "/v1/auth/tokens";
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const encoded = Buffer.from(`${client_id}:${client_secret}`, "utf-8").toString(
  "base64"
);

Router.post("/", async (req, res, next) => {
  const user = {
    name: req.body.email,
    password: req.body.password,
  };

  console.log("RECEIVED THE LOGIN REQUEST");

  try {
    let result = await axios.post(apiEndpoint, user);

    const userToken = result.headers["x-subject-token"];

    const options = {
      headers: {
        "X-Auth-token": token,
        "X-Subject-token": userToken,
      },
    };

    result = await axios.get(apiEndpoint, options);
    const userId = result.data.User.id;

    result = await axios.get(
      `${config.keyrockUrl}/v1/users/${userId}`,
      options
    );

    // console.log(result);
    const userObject = result.data.user;
    // if (userObject.extra === "unapproved") {
    //   return res.status(401).send("You are not confirmed yet");
    // }

    const oauth = await generateOauthToken(user);

    const jwt = generateAuthToken(userObject, oauth);

    return res.send(jwt);
  } catch (ex) {
    if (ex.response && ex.response.status === 401) {
      return res.status(401).send("Invalid e-mail or password");
    }
  }
});

async function generateOauthToken(user) {
  const params = new URLSearchParams();
  params.append("username", user.name);
  params.append("password", user.password);
  params.append("grant_type", "password");

  const options = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${encoded}`,
    },
  };

  const { data } = await axios.post(
    `${config.keyrockUrl}/oauth2/token`,
    params,
    options
  );
  return data.access_token;
}

function generateAuthToken(user, oauth) {
  const privateKey = "imthekey";
  const jwttoken = jwt.sign(
    {
      _id: user.id,
      firstname: user.username,
      lastname: user.description,
      role: user.website,
      status: "approved", //user.extra
      oauth: oauth,
    },
    privateKey
  );
  return jwttoken;
}

// function validate(user) {
//   const schema = Joi.object({
//     email: Joi.string().required(),
//     password: Joi.string().required(),
//   });

//   return schema.validate(user);
// }

module.exports = Router;
