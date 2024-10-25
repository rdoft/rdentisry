const axios = require("axios");

const sms = axios.create({
  baseURL: `${process.env.SMS_BASE_URL}`,
  headers: {
    "Content-Type": "application/xml",
  },
});

sms.interceptors.request.use((config) => {
  const to = config.data.to;
  const message = config.data.message;

  config.data = `<?xml version="1.0" encoding="UTF-8"?>
  <mainbody>
  <header>
  <company dil="TR">Netgsm</company>
  <usercode>${process.env.SMS_USERCODE}</usercode>
  <password>${process.env.SMS_PASSWORD}</password>
  <appkey>${process.env.SMS_APPKEY}</appkey>
  <msgheader>${process.env.SMS_SENDER}</msgheader>
  <type>1:n</type>
  </header>
  <body>
  <msg>
  <![CDATA[${message}]]>
  </msg>
  <no>${to}</no>
  </body>
  </mainbody>`;

  return config;
});

module.exports = sms;
