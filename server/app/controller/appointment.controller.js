const { Sequelize } = require("../models");
const db = require("../models");
const Appointment = db.appointment;
const Patient = db.patient;
const Doctor = db.doctor;

/**
 * Get appointment list
 */
exports.getAppointments = async (req, res) => {
  const { patientId, doctorId, from, to, status } = req.query;
  let appointments;

  try {
    // Find appointment list
    appointments = await Appointment.findAll({
      attributes: [
        ["AppointmentId", "id"],
        ["Date", "date"],
        ["StartTime", "startTime"],
        ["EndTime", "endTime"],
        ["Description", "description"],
        ["DidCome", "didCome"],
        ["Status", "status"],
        [Sequelize.literal("DATEDIFF(MINUTE, StartTime, EndTime)"), "duration"],
      ],
      where: {
        ...(status && { Status: status }),
        ...((from || to) && {
          Date: {
            ...(from && { [Sequelize.Op.gte]: new Date(from) }),
            ...(to && { [Sequelize.Op.lte]: new Date(to) }),
          },
        }),
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["PatientId", "id"],
            ["Idnumber", "idNumber"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["BirthYear", "birthYear"],
            ["Phone", "phone"],
          ],
          where: patientId && {
            PatientId: patientId,
          },
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: [
            ["DoctorId", "id"],
            ["Name", "name"],
            ["Surname", "surname"],
          ],
          where: doctorId && {
            DoctorId: doctorId,
          },
        },
      ],
      raw: true,
      nest: true,
    });

    res.status(200).send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Get an Appointment
 */
exports.getAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  let appointment;

  try {
    // Find appointment list
    appointment = await Appointment.findByPk(appointmentId, {
      attributes: [
        ["AppointmentId", "id"],
        ["Date", "date"],
        ["StartTime", "startTime"],
        ["EndTime", "endTime"],
        ["Description", "description"],
        ["DidCome", "didCome"],
        ["Status", "status"],
        [Sequelize.literal("DATEDIFF(MINUTE, StartTime, EndTime)"), "duration"],
      ],
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["PatientId", "id"],
            ["IdNumber", "idNumber"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["BirthYear", "birthYear"],
            ["Phone", "phone"],
          ],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: [
            ["DoctorId", "id"],
            ["Name", "name"],
            ["Surname", "surname"],
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    if (appointment) {
      res.status(200).send(appointment);
    } else {
      res.status(404).send({ message: "Randevu bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a Appointment
 * @body Appointment information
 */
exports.saveAppointment = async (req, res) => {
  const {
    patient,
    doctor,
    date,
    startTime,
    endTime,
    description,
    didCome,
    status,
  } = req.body;
  let values = {
    PatientId: patient.id,
    DoctorId: doctor ? doctor.id : null,
    Date: date,
    StartTime: Sequelize.cast(startTime, "TIME"),
    EndTime: Sequelize.cast(endTime, "TIME"),
    Description: description ?? null,
    DidCome: didCome ?? null,
    Status: status,
  };
  let appointment;

  try {
    // Create Appointment record
    appointment = await Appointment.create(values);
    appointment = {
      id: appointment.AppointmentId,
      patientId: appointment.PatientId,
      doctorId: appointment.DoctorId,
      date: appointment.Date,
      startTime: appointment.StartTime,
      endTime: appointment.EndTime,
      description: appointment.Description,
      didCome: appointment.DidCome,
      status: appointment.Status,
    };
    res.status(201).send(appointment);
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message: "Aynı doktora veya hastaya aynı saatte randevu oluşturulamaz",
      });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Update the Appointment
 * @param appointmentId: Id of the Appointment
 */
exports.updateAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const {
    patient,
    doctor,
    date,
    startTime,
    endTime,
    description,
    didCome,
    status,
  } = req.body;
  let values = {
    PatientId: patient.id,
    DoctorId: doctor ? doctor.id : null,
    Date: date,
    StartTime: Sequelize.cast(startTime, "TIME"),
    EndTime: Sequelize.cast(endTime, "TIME"),
    Description: description ?? null,
    DidCome: didCome ?? null,
    Status: status,
  };
  let appointment;

  try {
    // Find Appointment
    appointment = await Appointment.findByPk(appointmentId);

    if (appointment) {
      // Update the Appointment
      await appointment.update(values);

      res.status(200).send({ id: appointmentId });
    } else {
      res.status(404).send({ message: "Böyle bir randevu mevcut değil" });
    }
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message: "Aynı doktora veya hastaya aynı saatte randevu oluşturulamaz",
      });
    } else {
      res.status(500).send(error);
    }
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
    appointment = await Appointment.findByPk(appointmentId);

    // Delete the Appointment if it exists
    if (appointment) {
      await appointment.destroy();

      res.status(200).send({ id: appointmentId });
    } else {
      res.status(404).send({ message: "Randevu bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
