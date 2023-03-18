const { Sequelize } = require("../models");
const db = require("../models");
const Appointment = db.appointment;
const Patient = db.patient;
const Doctor = db.doctor;




/**
 * Get appointment list
 */
exports.getAppointments = async (req, res) => {
    let appointments;
  
    try {
      // Find appointment list
      appointments = await Appointment.findAll({
        include:[
          {
            model: Patient,
            as: "Patient"
          },
          {
            model: Doctor,
            as: 'Doctor'
          }
        ]
      });
      appointments = appointments.map((appointment) => {
        return {
          id: appointment.AppointmentId,
          patientName: appointment.Patient.Name + ' ' + appointment.Patient.Surname,
          doctorName:appointment.Doctor.Name + ' ' + appointment.Doctor.Surname,
          date:appointment.Date,
          startTime:appointment.StartTime,
          endTime:appointment.EndTime,
          didCome:appointment.DidCome,
          didAction:appointment.DidAction
        };
      });
  
      res.status(200).send(appointments);
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
    patientId: PatientId,
    doctorId: DoctorId,
    date: Date,
    startTime: StartTime,
    endTime: EndTime,
    didCome: DidCome,
    didAction: DidAction,
  } = req.body;
  let values = { PatientId, DoctorId, StartTime, EndTime, DidCome, DidAction, Date: Date ?? null };
  let appointment;

  try {
    // Create Appointment record
    appointment = await Appointment.create(values);
    appointment = {
      id: appointment.AppointmentId,
      patientId:appointment.Patientid,
      doctorId:appointment.Doctorid,
      date:appointment.Date,
      startTime:appointment.StartTime,
      endTime:appointment.EndTime,
      didCome:appointment.DidCome,
      didAction:appointment.DidAction,
    };
    res.status(201).send(appointment);
  } catch (error) {
    
    res.status(500).send(error);
  }

};
/**
 * Delete the Appointment
 * @param appointmentId: Id of the Appointment
 */
exports.deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  let appointment;

  try {
    // Find Appointment
    appointment = await Appointment.findOne({
      where: {
        AppointmentId: appointmentId,
      },
    });

    // Delete the Appointment if it exists
    if (appointment) {
      await appointment.destroy();

      res.status(200).send({ id: appointmentId });
    } else {
      res.status(404).send({ message: "Hasta bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};