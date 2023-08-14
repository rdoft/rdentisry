const axios = require("axios");

module.exports = axios.create({
  baseURL: `https://graph.facebook.com/${process.env.WP_VERSION}/${process.env.WP_PHONE}/messages`,
  headers: {
    "Authorization": `Bearer ${process.env.WP_TOKEN}`,
    "Content-Type": "application/json",
  },
});
