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
  } catch (error) {
    console.log(error);
  }
};
