const { Sequelize } = require("../models");
const db = require("../models");
const Appointment = db.appointment;
const Patient = db.patient;
const Doctor = db.doctor;

/**
 * Get appointment list
 */
exports.getAppointments = async (req, res) => {
  const { patientId: PatientId, from: from, to: to } = req.query;
  let appointments;

  try {
    // Find appointment list
    appointments = await Appointment.findAll({
      attributes: [
        "AppointmentId",
        "Date",
        "StartTime",
        "EndTime",
        "DidCome",
        "DidAction",
        [Sequelize.literal("DATEDIFF(MINUTE, StartTime, EndTime)"), "Duration"],
      ],
      where: (from || to) && {
        Date: {
          ...(from && { [Sequelize.Op.gte]: new Date(from) }),
          ...(to && { [Sequelize.Op.lte]: new Date(to) }),
        },
      },
      include: [
        {
          model: Patient,
          as: "Patient",
          where: PatientId && {
            PatientId: PatientId,
          },
        },
        {
          model: Doctor,
          as: "Doctor",
        },
      ],
      raw: true,
      nest: true,
    });

    appointments = appointments.map((appointment) => {
      return {
        id: appointment.AppointmentId,
        patientName: `${appointment.Patient.Name} ${appointment.Patient.Surname}`,
        doctorName: `${appointment.Doctor.Name} ${appointment.Doctor.Surname}`,
        date: appointment.Date,
        startTime: appointment.StartTime.toLocaleTimeString("tr-TR", {
          timeZone: "Etc/GMT-3",
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: appointment.EndTime.toLocaleTimeString("tr-TR", {
          timeZone: "Etc/GMT-3",
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: appointment.Duration,
        didCome: appointment.DidCome,
        didAction: appointment.DidAction,
      };
    });

    res.status(200).send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Get appointment list
 */
exports.getAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  let appointment;

  try {
    // Find appointment list
    appointment = await Appointment.findOne({
      attributes: [
        "AppointmentId",
        "Date",
        "StartTime",
        "EndTime",
        "DidCome",
        "DidAction",
        [Sequelize.literal("DATEDIFF(MINUTE, StartTime, EndTime)"), "Duration"],
      ],
      where: {
        AppointmentId: appointmentId,
      },
      include: [
        {
          model: Patient,
          as: "Patient",
        },
        {
          model: Doctor,
          as: "Doctor",
        },
      ],
      raw: true,
      nest: true,
    });

    appointment = {
      id: appointment.AppointmentId,
      patientName: `${appointment.Patient.Name} ${appointment.Patient.Surname}`,
      doctorName: `${appointment.Doctor.Name} ${appointment.Doctor.Surname}`,
      date: appointment.Date,
      startTime: appointment.StartTime.toLocaleTimeString("tr-TR", {
        timeZone: "Etc/GMT-3",
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: appointment.EndTime.toLocaleTimeString("tr-TR", {
        timeZone: "Etc/GMT-3",
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: appointment.Duration,
      didCome: appointment.DidCome,
      didAction: appointment.DidAction,
    };

    res.status(200).send(appointment);
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
    patientId: PatientId,
    doctorId: DoctorId,
    date: Date,
    startTime: StartTime,
    endTime: EndTime,
    didCome: DidCome,
    didAction: DidAction,
  } = req.body;
  let values = {
    PatientId,
    DoctorId: DoctorId ?? null,
    Date: Date,
    StartTime: Sequelize.cast(StartTime, "TIME"),
    EndTime: Sequelize.cast(EndTime, "TIME"),
    DidCome: DidCome ?? null,
    DidAction: DidAction ?? null,
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
      startTime: appointment.StartTime.toLocaleTimeString("tr-TR", {
        timeZone: "Etc/GMT-3",
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: appointment.EndTime.toLocaleTimeString("tr-TR", {
        timeZone: "Etc/GMT-3",
        hour: "2-digit",
        minute: "2-digit",
      }),
      didCome: appointment.DidCome,
      didAction: appointment.DidAction,
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
      res.status(404).send({ message: "Randevu bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
