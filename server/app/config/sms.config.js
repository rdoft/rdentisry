const { Netgsm } = require("@netgsm/sms");

// Initialize Netgsm client with credentials from environment variables
module.exports = new Netgsm({
  userCode: process.env.SMS_USERCODE,
  password: process.env.SMS_PASSWORD,
  appName: process.env.SMS_APPKEY,
});
