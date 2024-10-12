const SMS = require("../config/sms.config");
const log = require("../config/log.config");

// TODO: ADD these to .env file
// TODO: Test this service and fix errors
// Get env variables
const { SMS_USERNAME, SMS_PASSWORD, SMS_SENDER, SMS_APPKEY } = process.env;

/**
 * Sends an SMS message via the NetGSM API.
 * @param {string} to - The recipient's phone number.
 * @param {string} message - The SMS message content.
 * @returns {Promise} - A promise that resolves with the API response or an error.
 */
async function send(to, message) {
  try {
    const data = JSON.stringify({
      usercode: SMS_USERNAME,
      password: SMS_PASSWORD,
      msgheader: SMS_SENDER,
      appkey: SMS_APPKEY,
      gsmno: to,
      message: message,
      dil: "TR",
    });

    const response = await SMS.post("/send/get", data);

    // Handle response
    if (response.data.startsWith("00")) {
      log.app.info(`SMS successfully sent to ${to}.`);
    } else if (response.data.match(/^[0-9]{9}$/)) {
      log.app.info(
        `SMS successfully sent to ${to}. Message ID: ${response.data}`
      );
    } else if (response.data.startsWith("20")) {
      log.app.warn(
        `Send SMS to ${to} failed: Exceeded character limit or other issue.`
      );
    } else if (response.data.startsWith("30")) {
      log.app.warn(
        `Send SMS to ${to} failed: Invalid username/password or IP access restrictions.`
      );
    } else if (response.data.startsWith("40")) {
      log.app.warn(`Send SMS to ${to} failed: Sender name not registered.`);
    } else if (response.data.startsWith("70")) {
      log.app.warn(
        `Send SMS to ${to} failed: One or more required fields are missing.`
      );
    } else {
      log.app.warn(`Send SMS to ${to} failed: Unknown error, ${response.data}`);
    }
  } catch (error) {
    log.error.error(error);
    throw new Error(error);
  }
}

module.exports = {
  send: send,
};
