const axios = require("axios");

// TODO: ADD these to .env file
module.exports = axios.create({
  baseURL: `${process.env.SMS_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
