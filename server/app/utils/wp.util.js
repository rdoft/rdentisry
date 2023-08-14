const WP = require("../config/wp.config");

/**
 * Set and send the request options with message data
 * @param {object} data message object in JSON format
 */
exports.send = async (recipient, message) => {
  let data = JSON.stringify({
    messaging_product: "whatsapp",
    preview_url: false,
    recipient_type: "individual",
    to: recipient,
    type: "text",
    text: {
      body: message,
    },
  });
  
  try {
    const result = await WP.post("", data);
  } catch (err) {
    console.log(err);
  }

};
