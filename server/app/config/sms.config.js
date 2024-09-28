const axios = require("axios");

// Get env variables
const SMS_BASE_URL =
  process.env.SMS_BASE_URL || "https://api.netgsm.com.tr/sms";

module.exports = axios.create({
  baseURL: `${SMS_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
