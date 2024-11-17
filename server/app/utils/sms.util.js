const smsAPI = require("../config/sms.config");
const log = require("../config/log.config");
const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const SMS = db.sms;

const xml2js = require("xml2js");
const { setSMSLimit } = require("../utils/subscription.util");

const COOLDOWN = 4 * 60 * 60 * 1000; // cooldown time

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

    // Send SMS
    const response = await smsAPI.post("/send/xml", { to, message });

    // Handle response
    const [smsStatus, referenceCode] =
      response?.data?.toString()?.split(" ") ?? [];
    if (smsStatus === "00" || smsStatus === "01" || smsStatus === "02") {
      // Create the SMS and update the SMS limit
      await sequelize.transaction(async (t) => {
        await SMS.create(
          {
            UserId: userId,
            ReferenceCode: referenceCode,
            Phone: to,
            Status: "sent",
            Message: message,
            Type: type,
            IsAuto: isAuto,
          },
          { transaction: t }
        );
        await setSMSLimit(userId, -1, t);
      });

      log.app.info(`SMS successfully sent to ${to}.`);
      return referenceCode;
    } else if (smsStatus === "20") {
      log.app.warn(
        `Send SMS to ${to} failed: Exceeded character limit or other issue.`
      );
      const error = new Error(
        "Karakter sınırını aştınız veya başka bir sorun var"
      );
      error.code = 400;
      throw error;
    } else if (smsStatus === "30") {
      log.app.warn(
        `Send SMS to ${to} failed: Invalid username/password or IP access restrictions.`
      );
      const error = new Error(
        "Geçersiz kullanıcı adı/şifre veya IP erişim kısıtlamaları"
      );
      error.code = 400;
      throw error;
    } else if (smsStatus === "40") {
      log.app.warn(`Send SMS to ${to} failed: Sender name not registered.`);
      const error = new Error("Gönderici adı kayıtlı değil");
      error.code = 400;
      throw error;
    } else if (smsStatus === "70") {
      log.app.warn(
        `Send SMS to ${to} failed: One or more required fields are missing.`
      );
      const error = new Error("Bir veya daha fazla zorunlu alan eksik");
      error.code = 400;
      throw error;
    } else {
      log.app.warn(`Send SMS to ${to} failed: Unknown error, ${result}`);
      const error = new Error("Bilinmeyen hata");
      error.code = 400;
      throw error;
    }
  } catch (error) {
    !error.code && log.error.error(error);
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

    // Send status request
    const response = await smsAPI.post("/report", {
      status: true,
      referenceCode: sms.ReferenceCode,
    });

    // Handle response
    const result = await xml2js.parseStringPromise(
      response?.data?.toString() || ""
    );
    const smsStatus = result?.response?.job?.[0]?.status?.[0] ?? null;

    if (smsStatus === "1") {
      sms.update({ Status: "delivered", DeliveredDate: new Date() });
      log.app.info(`SMS status request for ${smsId} successful: delivered.`);
      return;
    } else if (smsStatus === "0") {
      if (sms.Retry < 3) {
        sms.increment("Retry");
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
          await setSMSLimit(sms.UserId, 1, t);
        });
        log.app.warn(`SMS status request for ${smsId} successful: Timeout.`);
        const error = new Error("SMS gönderimi zaman aşımına uğradı");
        error.code = 400;
        throw error;
      }
    } else if (smsStatus === "3") {
      await sequelize.transaction(async (t) => {
        await sms.update(
          { Status: "failed", Error: "SMS gönderilemedi: hatalı numara" },
          { transaction: t }
        );
        await setSMSLimit(sms.UserId, 1, t);
      });
      log.app.warn(
        `SMS status request for ${smsId} successful: Invalid number.`
      );
      const error = new Error("SMS gönderilemedi: hatalı numara");
      error.code = 400;
      throw error;
    } else if (smsStatus === "13") {
      await sequelize.transaction(async (t) => {
        await sms.update(
          { Status: "failed", Error: "SMS gönderilemedi: tekrarlı SMS hatası" },
          { transaction: t }
        );
        await setSMSLimit(sms.UserId, 1, t);
      });
      log.app.info(`SMS status request for ${smsId} successful: Duplicate.`);
      const error = new Error("SMS gönderilemedi: tekrarlı SMS hatası");
      error.code = 400;
      throw error;
    } else {
      await sequelize.transaction(async (t) => {
        await sms.update(
          { Status: "failed", Error: "SMS gönderilemedi: bilinmeyen hata" },
          { transaction: t }
        );
        await setSMSLimit(sms.UserId, 1, t);
      });
      log.app.warn(
        `SMS status request for ${smsId} failed: Unknown status, ${result}`
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
};
