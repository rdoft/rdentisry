const { Sequelize } = require("../models");
const db = require("../models");
const Appointment = db.Appointment;

/**
 * Get appointment list
 */
exports.getAppointment = async (req, res) => {
    let appointment;
  
    try {
      // Find appointment list
      appointment = await Appointment.findAll();
      appointment = appointment.map((appointment) => {
        return {
          id: appointment.AppointmentId,
          patientid:appointment.patientid,
          doctorid:appointment.doctorid,
          date:appointment.date,
          starttime:appointment.starttime,
          endtime:appointment.endtime,
          didcome:appointment.didcome,
          didaction:appointment.didaction
        };
      });
  
      res.status(200).send(appointment);
    } catch (error) {
      res.status(500).send(error);
    }
  };