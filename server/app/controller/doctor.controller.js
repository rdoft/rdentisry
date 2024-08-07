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
  } catch (error) {
    res.status(500).send(error);
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
  } catch (error) {
    res.status(500).send(error);
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
    } else {
      res.status(404).send({ message: "Doktor mevcut değil" });
    }
  } catch (error) {
    res.status(500).send(error);
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
    } else {
      res.status(404).send({ message: "Doktor mevcut değil" });
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send(error);
    }
  }
};
