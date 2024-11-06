const sms = require("../config/sms.config");
const log = require("../config/log.config");

/**
 * Sends an SMS message via the NetGSM API.
 * @param {string} to - The recipient's phone number.
 * @param {string} message - The SMS message content.
 * @returns - True if the message was sent successfully, false otherwise.
 */
async function send(to, message) {
  try {
    // Send SMS
    const response = await sms.post("/send/xml", { to, message });

    if (!response.data) {
      log.app.warn(`Send SMS to ${to} failed: No response from API.`);
      return false;
    }

    // Handle response
    const result = response.data.toString();
    if (
      result.startsWith("00") ||
      result.startsWith("01") ||
      result.startsWith("02")
    ) {
      log.app.info(`SMS successfully sent to ${to}.`);
      return true;
    } else if (result.startsWith("20")) {
      log.app.warn(
        `Send SMS to ${to} failed: Exceeded character limit or other issue.`
      );
      return false;
    } else if (result.startsWith("30")) {
      log.app.warn(
        `Send SMS to ${to} failed: Invalid username/password or IP access restrictions.`
      );
      return false;
    } else if (result.startsWith("40")) {
      log.app.warn(`Send SMS to ${to} failed: Sender name not registered.`);
      return false;
    } else if (result.startsWith("70")) {
      log.app.warn(
        `Send SMS to ${to} failed: One or more required fields are missing.`
      );
      return false;
    } else {
      log.app.warn(`Send SMS to ${to} failed: Unknown error, ${result}`);
      return false;
    }
  } catch (error) {
    log.error.error(error);
    throw new Error(error);
  }
}

module.exports = {
  send,
};
