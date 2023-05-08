const { Sequelize } = require("../models");
const db = require("../models");
const Doctor = db.doctor;

/**
 * Get doctor list
 */
exports.getDoctors = async (req, res) => {
  let doctors;

  try {
    // Find patient list
    doctors = await Doctor.findAll();
    doctors = doctors.map((doctor) => {
      return {
        id: doctor.DoctorId,
        name: doctor.Name,
        surname: doctor.Surname,
      };
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
  const { name: Name, surname: Surname } = req.body;
  let values = { Name, Surname };
  let doctor;

  try {
    // Create doctor record
    doctor = await Doctor.create(values);
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
  const { doctorId } = req.params;
  const { name: Name, surname: Surname } = req.body;
  let values = { Name, Surname };
  let doctor;

  try {
    // Find the doctor record
    doctor = await Patient.findByPk(doctorId);

    if (doctor) {
      // Update doctor record
      await doctor.update(values);

      res.status(200).send({ id: doctorId });
    } else {
      res.status(404).send({ message: "Böyle bir doktor mevcut değil" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
