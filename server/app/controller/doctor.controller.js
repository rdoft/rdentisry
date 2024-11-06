const log = require("../config/log.config");
const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const Doctor = db.doctor;

const { setDoctorLimit } = require("../utils/subscription.util");

/**
 * Get doctor list
 */
exports.getDoctors = async (req, res) => {
  const { UserId: userId } = req.user;
  const { maxDoctors } = req.limit;
  let doctors;

  try {
    // Find doctor list
    doctors = await Doctor.findAll({
      attributes: [
        ["DoctorId", "id"],
        ["Name", "name"],
        ["Surname", "surname"],
      ],
      where: {
        UserId: userId,
      },
      limit: maxDoctors,
    });

    res.status(200).send(doctors);
    log.audit.info("Get doctors completed", {
      userId,
      action: "GET",
      success: true,
      resource: {
        type: "doctor",
        count: doctors.length,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Add a doctor
 * @body Doctor informations
 */
exports.saveDoctor = async (req, res) => {
  const { UserId: userId } = req.user;
  const { name, surname } = req.body;
  let values = { Name: name, Surname: surname, UserId: userId };

  try {
    // Check if the doctor already exists
    let doctor = await Doctor.findOne({
      where: values,
    });

    if (doctor) {
      res
        .status(400)
        .send({ message: "Doktor zaten kayıtlıdır, tekrar kaydedilemez." });
      log.audit.warn("Save doctor failed: Doctor already exists", {
        userId,
        action: "POST",
        success: false,
        resource: {
          type: "doctor",
          id: doctor.DoctorId,
        },
      });
      return;
    }

    // Create doctor record & decrease the doctor limit
    doctor = await sequelize.transaction(async (t) => {
      const doctor = await Doctor.create(values, { transaction: t });
      await setDoctorLimit(userId, -1, t);
      return {
        id: doctor.DoctorId,
        name: doctor.Name,
        surname: doctor.Surname,
      };
    });

    res.status(201).send(doctor);
    log.audit.info("Save doctor completed", {
      userId,
      action: "POST",
      success: true,
      resource: {
        type: "doctor",
        id: doctor.id,
      },
    });
  } catch (error) {
    error.code
      ? res.status(error.code).send({ message: error.message })
      : res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Update the doctor
 * @param doctorId id of the doctor
 * @body Doctor informations
 */
exports.updateDoctor = async (req, res) => {
  const { UserId: userId } = req.user;
  const { doctorId } = req.params;
  const { name, surname } = req.body;
  let values = { Name: name, Surname: surname };
  let doctor;

  try {
    // Find the doctor record
    doctor = await Doctor.findOne({
      where: {
        DoctorId: doctorId,
        UserId: userId,
      },
    });

    if (doctor) {
      // Update doctor record
      await doctor.update(values);

      res.status(200).send({ id: doctorId });
      log.audit.info("Update doctor completed", {
        userId,
        action: "PUT",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "doctor",
          id: doctorId,
        },
      });
    } else {
      res.status(404).send({ message: "Doktor mevcut değil" });
      log.audit.warn("Update doctor failed: Doctor doesn't exist", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "doctor",
          id: doctorId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Delete the doctor
 * @param doctorId: Id of the doctor
 */
exports.deleteDoctor = async (req, res) => {
  const { UserId: userId } = req.user;
  const { doctorId } = req.params;
  let doctor;

  try {
    // Find the doctor record
    doctor = await Doctor.findOne({
      where: {
        DoctorId: doctorId,
        UserId: userId,
      },
    });

    // Delete the doctor if it exists & increase the doctor limit
    if (doctor) {
      await sequelize.transaction(async (t) => {
        await doctor.destroy({ transaction: t });
        await setDoctorLimit(userId, 1, t);
      });

      res.status(200).send({ id: doctorId });
      log.audit.info("Delete doctor completed", {
        userId,
        action: "DELETE",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "doctor",
          id: doctorId,
        },
      });
    } else {
      res.status(404).send({ message: "Doktor mevcut değil" });
      log.audit.warn("Delete doctor failed: Doctor doesn't exist", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "doctor",
          id: doctorId,
        },
      });
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({ message: error.message });
      log.audit.warn("Delete doctor failed: Validation error", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "doctor",
          id: doctorId,
        },
      });
    } else {
      error.code
        ? res.status(error.code).send({ message: error.message })
        : res.status(500).send(error);
      log.error.error(error);
    }
  }
};
