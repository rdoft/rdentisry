const { Sequelize } = require("../models");
const db = require("../models");
const Appointment = db.appointment;
const Patient = db.patient;
const Doctor = db.doctor;

/**
 * Get appointment list
 */
exports.getAppointments = async (req, res) => {
  const {
    patientId: patientId,
    from: from,
    to: to,
    status: status,
  } = req.query;
  let appointments;

  try {
    // Find appointment list
    appointments = await Appointment.findAll({
      attributes: [
        "AppointmentId",
        "Date",
        "StartTime",
        "EndTime",
        "Description",
        "DidCome",
        "Status",
        [Sequelize.literal("DATEDIFF(MINUTE, StartTime, EndTime)"), "Duration"],
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
          as: "Patient",
          where: patientId && {
            PatientId: patientId,
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
        description: appointment.Description,
        didCome: appointment.DidCome,
        status: appointment.Status,
      };
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
        "AppointmentId",
        "Date",
        "StartTime",
        "EndTime",
        "Description",
        "DidCome",
        "Status",
        [Sequelize.literal("DATEDIFF(MINUTE, StartTime, EndTime)"), "Duration"],
      ],
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

    if (appointment) {
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
        description: appointment.Description,
        didCome: appointment.DidCome,
        status: appointment.Status,
      };

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
    patientId: PatientId,
    doctorId: DoctorId,
    date: Date,
    startTime: StartTime,
    endTime: EndTime,
    description: Description,
    didCome: DidCome,
    status: Status,
  } = req.body;
  let values = {
    PatientId,
    DoctorId: DoctorId ?? null,
    Date: Date,
    StartTime: Sequelize.cast(StartTime, "TIME"),
    EndTime: Sequelize.cast(EndTime, "TIME"),
    Description: Description ?? null,
    DidCome: DidCome ?? null,
    Status: Status,
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
    patientId: PatientId,
    doctorId: DoctorId,
    date: Date,
    startTime: StartTime,
    endTime: EndTime,
    description: Description,
    didCome: DidCome,
    status: Status,
  } = req.body;
  let values = {
    PatientId,
    DoctorId: DoctorId ?? null,
    Date: Date,
    StartTime: Sequelize.cast(StartTime, "TIME"),
    EndTime: Sequelize.cast(EndTime, "TIME"),
    Description: Description ?? null,
    DidCome: DidCome ?? null,
    Status: Status,
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
