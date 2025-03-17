const netgsm = require("../config/sms.config");
const log = require("../config/log.config");
const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const SMS = db.sms;

const { setSMSLimit } = require("../utils/subscription.util");

const SMS_SENDER = process.env.SMS_SENDER;
const COOLDOWN = 4 * 60 * 60 * 1000; // cooldown time
const TURKISH_CHARS = [
  "ç",
  "Ç",
  "ğ",
  "Ğ",
  "ı",
  "İ",
  "ö",
  "Ö",
  "ş",
  "Ş",
  "ü",
  "Ü",
];

/**
 * Calculates the SMS package size based on message length
 * - 0-150 characters: 1 package
 * - 151-291 characters: 2 packages
 * - and so on...
 *
 * Note: Turkish characters and new lines count as 2 characters
 *
 * @param {string} message - The SMS message content
 * @returns {number} - The number of SMS packages required
 */
function calculateSMSSize(message) {
  if (!message) return 1;

  let effectiveLength = 0;

  // Count each character
  for (let i = 0; i < message.length; i++) {
    const char = message[i];

    // Check if it's a Turkish character
    if (TURKISH_CHARS.includes(char)) {
      effectiveLength += 2;
    }
    // Check if it's a new line
    else if (char === "\n" || char === "\r") {
      effectiveLength += 2;
    }
    // Regular character
    else {
      effectiveLength += 1;
    }
  }

  // Calculate package size
  // 1-150 chars: 1 package, 151-291 chars: 2 packages, 292+ chars: 3 packages
  if (effectiveLength <= 150) return 1;
  if (effectiveLength <= 291) return 2;
  return 3;
}

/**
 * Sends an SMS message via the NetGSM API.
 * @param {int} userId - The user ID of the sender.
 * @param {string} to - The recipient's phone number.
 * @param {string} message - The SMS message content.
 * @param {string} type - The type of the SMS message.
 * @param {boolean} isAuto - Whether the SMS message is sent automatically.
 * @returns - The reference code of the sent SMS.
 */
async function send(userId, to, message, type, isAuto) {
  try {
    // Control the SMS to not to send duplicate (wait for cooldown)
    const sms = await SMS.findOne({
      where: {
        UserId: userId,
        Phone: to,
        Status: {
          [Sequelize.Op.in]: ["sent", "delivered"],
        },
        Type: type,
        CreatedDate: {
          [Sequelize.Op.gte]: new Date(Date.now() - COOLDOWN),
        },
      },
    });
    if (sms) {
      log.app.warn(`Send duplicate SMS to ${to} failed`);
      const error = new Error(
        "Bir numaraya aynı mesaj 4 saat içinde sadece bir kez gönderilebilir"
      );
      error.code = 400;
      throw error;
    }

    // Calculate SMS package size
    const size = calculateSMSSize(message);

    // Send SMS using the netgsm package
    const response = await netgsm.sendRestSms({
      msgheader: SMS_SENDER,
      encoding: "TR",
      messages: [{ msg: message, no: to }],
    });

    // Handle response
    if (response && response.jobid) {
      // Create the SMS and update the SMS limit based on package size
      await sequelize.transaction(async (t) => {
        await SMS.create(
          {
            UserId: userId,
            ReferenceCode: response.jobid,
            Phone: to,
            Status: "sent",
            Message: message,
            Type: type,
            IsAuto: isAuto,
          },
          { transaction: t }
        );
        await setSMSLimit(userId, -size, t);
      });

      log.app.info(`SMS successfully sent to ${to}. Package size: ${size}`);
      return response.jobid;
    } else {
      log.app.warn(
        `Send SMS to ${to} failed: Unknown error, ${JSON.stringify(response)}`
      );
      const error = new Error("SMS gönderilemedi: bilinmeyen hata");
      error.code = 400;
      throw error;
    }
  } catch (error) {
    if (!error.code) {
      log.error.error(error);
      throw error;
    }

    // Handle Netgsm API error codes
    switch (error.code) {
      case "20":
        log.app.warn(
          `Send SMS to ${to} failed: Character limit exceeded or message problem.`
        );
        error = new Error(
          "Karakter sınırını aştınız veya mesaj metninde sorun var"
        );
        break;
      case "30":
        log.app.warn(
          `Send SMS to ${to} failed: Invalid credentials or IP restriction.`
        );
        error = new Error(
          "Geçersiz kullanıcı adı/şifre veya IP erişim kısıtlamaları"
        );
        break;
      case "40":
        log.app.warn(`Send SMS to ${to} failed: Sender name not registered.`);
        error = new Error("Gönderici adı kayıtlı değil");
        break;
      case "50":
        log.app.warn(
          `Send SMS to ${to} failed: IYS controlled submissions issue.`
        );
        error = new Error("IYS kontrollü gönderimler sorunu");
        break;
      case "51":
        log.app.warn(`Send SMS to ${to} failed: No IYS Brand information.`);
        error = new Error("IYS Marka bilgisi bulunamadı");
        break;
      case "70":
        log.app.warn(`Send SMS to ${to} failed: Invalid parameters.`);
        error = new Error("Geçersiz parametreler veya eksik zorunlu alan");
        break;
      case "80":
        log.app.warn(`Send SMS to ${to} failed: Sending limit exceeded.`);
        error = new Error("Gönderim limiti aşıldı");
        break;
      case "85":
        log.app.warn(
          `Send SMS to ${to} failed: Duplicate sending limit exceeded.`
        );
        error = new Error("Tekrarlı gönderim limiti aşıldı");
        break;
      default:
        log.app.warn(`Send SMS to ${to} failed: ${error.message}`);
    }

    error.code = 400;
    throw error;
  }
}

/**
 * Checks & update the status of the sent SMS
 * @param {string} smsId - The SMS ID of the sent SMS
 * @returns - empty
 */
async function status(smsId) {
  try {
    // Find the sms
    const sms = await SMS.findOne({
      where: {
        SMSId: smsId,
        Status: "sent",
      },
    });
    if (!sms) {
      log.app.warn(`SMS status request for ${smsId} failed: Not found.`);
      const error = new Error("SMS bulunamadı");
      error.code = 400;
      throw error;
    }

    // Calculate SMS package size
    const size = calculateSMSSize(sms.Message);

    // Get SMS report using the new Netgsm package
    const response = await netgsm.getReport({
      bulkIds: [sms.ReferenceCode],
      reportType: 1, // SINGLE_BULKID
    });

    // Handle response
    const smsStatus = response?.jobs?.[0]?.status ?? null;

    // 0: Pending, 1: Delivered, 2: Failed, 3: Invalid number, etc.
    if (smsStatus === 1) {
      await sms.update({ Status: "delivered", DeliveredDate: new Date() });
      log.app.info(`SMS status request for ${smsId} successful: delivered.`);
      return;
    } else if (smsStatus === 0) {
      if (sms.Retry < 12) {
        await sms.increment("Retry");
        log.app.warn(`SMS status request for ${smsId} successful: Pending.`);
        const error = new Error("SMS Beklemede");
        error.code = 400;
        throw error;
      } else {
        await sequelize.transaction(async (t) => {
          await sms.update(
            { Status: "failed", Error: "SMS gönderilemedi: zaman aşımı" },
            { transaction: t }
          );
          await setSMSLimit(sms.UserId, size, t);
        });
        log.app.warn(`SMS status request for ${smsId} successful: Timeout.`);
        const error = new Error("SMS gönderimi zaman aşımına uğradı");
        error.code = 400;
        throw error;
      }
    } else if (smsStatus === 3) {
      await sequelize.transaction(async (t) => {
        await sms.update(
          { Status: "failed", Error: "SMS gönderilemedi: hatalı numara" },
          { transaction: t }
        );
        await setSMSLimit(sms.UserId, size, t);
      });
      log.app.warn(
        `SMS status request for ${smsId} successful: Invalid number.`
      );
      const error = new Error("SMS gönderilemedi: hatalı numara");
      error.code = 400;
      throw error;
    } else {
      await sequelize.transaction(async (t) => {
        await sms.update(
          { Status: "failed", Error: "SMS gönderilemedi: bilinmeyen hata" },
          { transaction: t }
        );
        await setSMSLimit(sms.UserId, size, t);
      });
      log.app.warn(
        `SMS status request for ${smsId} failed: Unknown status, ${JSON.stringify(
          response
        )}`
      );
      const error = new Error("SMS gönderilemedi: bilinmeyen hata");
      error.code = 400;
      throw error;
    }
  } catch (error) {
    !error.code && log.error.error(error);
    throw error;
  }
}

module.exports = {
  send,
  status,
  calculateSMSSize,
};
