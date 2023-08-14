const { Sequelize } = require("../models");
const db = require("../models");
const wp = require("../utils/wp.util");

const Appointment = db.appointment;
const Patient = db.patient;

exports.run = async () => {
  let appointments;
  const today = new Date();
  const tomorow = new Date().setDate(today.getDate() + 1);

  try {
    // Find tomorow's appointments
    appointments = await Appointment.findAll({
      attributes: [
        ["Date", "date"],
        ["StartTime", "startTime"],
        ["EndTime", "endTime"],
      ],
      where: {
        Date: {
          [Sequelize.Op.gt]: today,
          [Sequelize.Op.lte]: tomorow,
        },
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["Name", "name"],
            ["Surname", "surname"],
            ["Phone", "phone"],
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    // Send wp message for all appointments on tomorrow
    appointments.map((appointment) => {
      let message = `HATIRLATMA
        Sn. ${appointment.patient.name} ${appointment.patient.surname},
        Gül Diş Kliniğinde randevunuz bulunmaktadır, katılım durumunuzu lütfen bize bildirin.
        
        Tarih: ${appointment.date}
        Saat: ${appointment.startTime}`;

      wp.send(appointment.patient.phone, message);
    });
  } catch (error) {
    console.log(error);
  }
};
