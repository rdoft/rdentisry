const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Doctor = db.doctor;

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
  let doctor;

  try {
    // Create doctor record
    [doctor, _] = await Doctor.findOrCreate({
      where: values,
    });
    doctor = {
      id: doctor.DoctorId,
      name: doctor.Name,
      surname: doctor.Surname,
    };

    res.status(201).send(doctor);
    log.audit.info("Save doctor completed", {
      userId,
      action: "POST",
      success: true,
      resource: {
        type: "doctor",
        count: 1,
        id: doctor.id,
      },
    });
  } catch (error) {
    res.status(500).send(error);
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
          count: 1,
          id: doctorId,
        },
      });
    } else {
      res.status(404).send({ message: "Doktor mevcut değil" });
      log.audit.info("Update doctor failed: Doctor doesn't exist", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "doctor",
          count: 0,
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

    // Delete the doctor if it exists
    if (doctor) {
      await doctor.destroy();

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
          count: 1,
          id: doctorId,
        },
      });
    } else {
      res.status(404).send({ message: "Doktor mevcut değil" });
      log.audit.info("Delete doctor failed: Doctor doesn't exist", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "doctor",
          count: 0,
        },
      });
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({ message: error.message });
      log.audit.info("Delete doctor failed: Validation error", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "doctor",
          count: 0,
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};
