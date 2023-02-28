const db = require("../models");
const Patient = db.patient;

// Get patient list
exports.getPatients = async (req, res) => {
  let patients;

  try {
    // Find patient list
    patients = await Patient.findAll();

    res.status(200).send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

/**
 * Add a patient
 * @body Patient informations
 */
exports.addPatient = async (req, res) => {
  // TODO: Add control mechanism
  const value = req.body;
  let patient;

  try {
    // Create patient record
    patient = await Patient.create(value);

    res.status(200).send({ id: patient.PatientId });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

/**
 * Delete the patient
 * @param id: Id of the patient
 */
exports.deletePatient = async (req, res) => {
  // TODO: Add control mechanism
  const patientId = req.params.id;

  try {
    // Delete patient record
    await Patient.destroy({
      where: {
        PatientId: patientId,
      },
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
