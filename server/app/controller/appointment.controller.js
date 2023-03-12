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
/**
 * Add a Appointment 
 * @body Appointment information
 */
exports.AddAppointment = async (req,res) => {
  const {
    patientid: PatientId,
    doctorid: DoctorId,
    date: Date,
    starttime: StartTime,
    endtime: EndTime,
    didcome: DidCome,
    didaction: DidAction,
  } = req.body;
  let values = { PatientId, DoctorId, StartTime, EndTime, DidCome, DidAction, Date: Date ?? null };
  let appointment;

  try {
    // Create Appointment record
    appointment = await p.create(values);
    appointment = {
      id: appointment.AppointmentId,
      patientid:appointment.patientid,
      doctorid:appointment.doctorid,
      date:appointment.date,
      starttime:appointment.starttime,
      endtime:appointment.endtime,
      didcome:appointment.didcome,
      didaction:appointment.didaction,
    };
    res.status(201).send(appointment);
  } catch (error) {
    
    res.status(500).send(error);
  }

};