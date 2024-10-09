const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Appointment = db.appointment;
const Patient = db.patient;
const Doctor = db.doctor;

/**
 * Get appointment list
 */
exports.getAppointments = async (req, res) => {
  const { UserId: userId } = req.user;
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
        ["Status", "status"],
        ["ReminderStatus", "reminderStatus"],
        [
          Sequelize.literal(
            `CAST(EXTRACT(EPOCH FROM ("EndTime" - "StartTime")) / 60 AS INTEGER)`
          ),
          "duration",
        ],
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
            ["IdNumber", "idNumber"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["BirthYear", "birthYear"],
            ["Phone", "phone"],
          ],
          where: {
            UserId: userId,
            ...(patientId && { PatientId: patientId }),
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
      order: [
        ["Date", "ASC"],
        ["StartTime", "ASC"],
      ],
    });

    let appointments_ = [];
    appointments.map((appointment) => {
      appointment.startTime = new Date(`1970-01-01T${appointment.startTime}Z`);
      appointment.endTime = new Date(`1970-01-01T${appointment.endTime}Z`);
      appointment.doctor = appointment.doctor?.id ? appointment.doctor : null;
      appointments_.push(appointment);
    });

    res.status(200).send(appointments_);
    log.audit.info("Get appointments completed", {
      userId,
      action: "GET",
      success: true,
      request: {
        params: req.params,
        query: req.query,
      },
      resource: {
        type: "appointment",
        count: appointments_.length,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Get an Appointment
 */
exports.getAppointment = async (req, res) => {
  const { UserId: userId } = req.user;
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
        ["Status", "status"],
        ["ReminderStatus", "reminderStatus"],
        [
          Sequelize.literal(
            `CAST(EXTRACT(EPOCH FROM ("EndTime" - "StartTime")) / 60 AS INTEGER)`
          ),
          "duration",
        ],
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
          where: {
            UserId: userId,
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
        },
      ],
      raw: true,
      nest: true,
    });

    if (appointment) {
      appointment.startTime = new Date(`1970-01-01T${appointment.startTime}Z`);
      appointment.endTime = new Date(`1970-01-01T${appointment.endTime}Z`);
      appointment.doctor = appointment.doctor?.id ? appointment.doctor : null;

      res.status(200).send(appointment);
      log.audit.info("Get appointment completed", {
        userId,
        action: "GET",
        success: true,
        request: {
          params: req.params,
          query: req.query,
        },
        resource: {
          type: "appointment",
          id: appointmentId,
        },
      });
    } else {
      res.status(404).send({ message: "Randevu mevcut değil" });
      log.audit.warn("Get appointment failed: Appointment doesn't exist", {
        userId,
        action: "GET",
        success: false,
        request: {
          params: req.params,
          query: req.query,
        },
        resource: {
          type: "appointment",
          id: appointmentId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Add a Appointment
 * @body Appointment information
 */
exports.saveAppointment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patient, doctor, date, startTime, endTime, description, status } =
    req.body;
  let values = {
    PatientId: patient.id,
    DoctorId: doctor ? doctor.id : null,
    Date: date,
    StartTime: Sequelize.cast(startTime, "TIME"),
    EndTime: Sequelize.cast(endTime, "TIME"),
    Description: description ?? null,
    Status: status,
    ReminderStatus: null,
  };
  let appointment;

  try {
    // Get patient and doctor and control if they belongs to the authenticated user
    const patientRecord = await Patient.findOne({
      where: {
        PatientId: patient.id,
        UserId: userId,
      },
    });
    const doctorRecord = doctor
      ? await Doctor.findOne({
          where: {
            DoctorId: doctor.id,
            UserId: userId,
          },
        })
      : null;

    if (!patientRecord || (doctor && !doctorRecord)) {
      res.status(404).send({
        message: "Randevu oluşturmak istenen hasta veya doktor mevcut değil",
      });
      log.audit.warn("Save appointment failed: Patient or doctor not exist ", {
        userId,
        action: "POST",
        success: false,
        request: {
          body: req.body,
        },
        resource: {
          type: "appointment",
        },
      });
      return;
    }

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
      status: appointment.Status,
      reminderStatus: appointment.ReminderStatus,
    };
    res.status(201).send(appointment);
    log.audit.info("Save appointment completed", {
      userId,
      action: "POST",
      success: true,
      resource: {
        type: "appointment",
        id: appointment.id,
      },
    });
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message: "Aynı doktora veya hastaya aynı saatte randevu oluşturulamaz",
      });
      log.audit.warn(
        "Save appointment failed: There is an appointment for the same doctor or patient at the current time",
        {
          userId,
          action: "POST",
          success: false,
          resource: {
            type: "appointment",
          },
        }
      );
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};

/**
 * Update the Appointment
 * @param appointmentId: Id of the Appointment
 */
exports.updateAppointment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { appointmentId } = req.params;
  const {
    patient,
    doctor,
    date,
    startTime,
    endTime,
    description,
    status,
    reminderStatus,
  } = req.body;
  let values = {
    PatientId: patient.id,
    DoctorId: doctor ? doctor.id : null,
    Date: date,
    StartTime: Sequelize.cast(startTime, "TIME"),
    EndTime: Sequelize.cast(endTime, "TIME"),
    Description: description ?? null,
    Status: status,
    ReminderStatus: reminderStatus ?? null,
  };
  let appointment;

  try {
    // Validations
    const patientRecord = await Patient.findOne({
      where: {
        PatientId: patient.id,
        UserId: userId,
      },
    });
    const doctorRecord =
      doctor &&
      (await Doctor.findOne({
        where: {
          DoctorId: doctor.id,
          UserId: userId,
        },
      }));

    if (!patientRecord || (doctor && !doctorRecord)) {
      res.status(404).send({
        message: "Güncellenen hasta veya doktor bilgisi mevcut değil",
      });
      log.audit.warn("Update appointment failed: Patient or doctor not exist", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "appointment",
          id: appointmentId,
        },
      });
      return;
    }

    // Find Appointment
    appointment = await Appointment.findOne({
      where: {
        AppointmentId: appointmentId,
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [],
          where: {
            UserId: userId,
          },
        },
      ],
    });

    if (appointment) {
      // Update the Appointment
      await appointment.update(values);

      res.status(200).send({ id: appointmentId });
      log.audit.info("Update appointment completed", {
        userId,
        action: "PUT",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "appointment",
          id: appointmentId,
        },
      });
    } else {
      res.status(404).send({ message: "Randevu mevcut değil" });
      log.audit.warn("Update appointment failed: Appointment doesn't exist", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "appointment",
          id: appointmentId,
        },
      });
    }
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message: "Aynı doktora veya hastaya aynı saatte randevu oluşturulamaz",
      });
      log.audit.warn(
        "Update appointment failed: There is an appointment for the same doctor or patient at the current time",
        {
          userId,
          action: "PUT",
          success: false,
          request: {
            params: req.params,
          },
          resource: {
            type: "appointment",
            id: appointmentId,
          },
        }
      );
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};

/**
 * Delete the Appointment
 * @param appointmentId: Id of the Appointment
 */
exports.deleteAppointment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { appointmentId } = req.params;
  let appointment;

  try {
    // Find Appointment
    appointment = await Appointment.findOne({
      where: {
        AppointmentId: appointmentId,
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [],
          where: {
            UserId: userId,
          },
        },
      ],
    });

    // Delete the Appointment if it exists
    if (appointment) {
      await appointment.destroy();

      res.status(200).send({ id: appointmentId });
      log.audit.info("Delete appointment completed", {
        userId,
        action: "DELETE",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "appointment",
          id: appointmentId,
        },
      });
    } else {
      res.status(404).send({ message: "Randevu mevcut değil" });
      log.audit.warn("Delete appointment failed: Appointment doesn't exist", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "appointment",
          id: appointmentId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Get the statuses
 */
exports.getStatuses = async (req, res) => {
  let statuses = ["active", "completed", "canceled", "absent"];
  res.status(200).send(statuses);
};
