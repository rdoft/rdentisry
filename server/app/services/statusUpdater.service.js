const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");

const Appointment = db.appointment;

exports.run = async () => {
  let appointments;
  const today = new Date();

  try {
    // Find "active" appointments until today
    // Update these appointments' status as "completed"
    appointments = await Appointment.update(
      { Status: "completed" },
      {
        where: {
          Date: {
            [Sequelize.Op.lte]: today,
          },
          Status: "active",
        },
      }
    );

    log.app.info(`Service: Updated status of ${appointments[0]} appointments`);
  } catch (error) {
    log.error.error(error);
  }
};
