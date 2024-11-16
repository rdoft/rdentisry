const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const SMS = db.sms;

const { status } = require("../utils/sms.util");

/**
 * Control the all SMS status that are sent.
 */
exports.run = async () => {
  try {
    // Find all SMS that are sent
    const smsList = await SMS.findAll({
      where: {
        Status: {
          [Sequelize.Op.in]: ["sent"],
        },
      },
    });

    // Check & update the status of each SMS
    for (const sms of smsList) {
      try {
        await status(sms.SMSId);
      } catch (error) {
        !error.code && log.error.error(error);
      }
    }

    log.app.info("Service: SMS status check completed.");
  } catch (error) {
    log.error.error(error);
  }
};
