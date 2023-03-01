const { Sequelize } = require("../models");
const db = require("../models");
const Patient = db.patient;
  // TODO: [RDEN-30] Add control mechanism for controller with joi
  // TODO: [RDEN-31] Add comments in the controller and routes

// Get patient list
exports.getPatients = async (req, res) => {
  let patients;

  try {
    // Find patient list
    patients = await Patient.findAll();
    patients = patients.map((patient) => {
      return {
        id: patient.PatientId,
        name: patient.Name,
        surname: patient.Surname,
        phone: patient.Phone,
        idNumber: patient.IdNumber,
      };
    });

    res.status(200).send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

/**
 * Delete patients of the given Ids
 * @query patientId: Id list of patients
 */
exports.deletePatients = async (req, res) => {
  const { patientId } = req.query;
  let patientIds;

  try {
    // Delete patient record
    patientIds = patientId.split(",");
    await Patient.destroy({
      where: {
        PatientId: {
          [Sequelize.Op.in]: patientIds,
        },
      },
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

/**
 * Add a patient
 * @body Patient informations
 */
exports.savePatient = async (req, res) => {
  const {
    name: Name,
    surname: Surname,
    phone: Phone,
    idNumber: IdNumber,
  } = req.body;
  let values = { Name, Surname, Phone, IdNumber };
  let patient;

  try {
    // Create patient record
    patient = await Patient.create(values);

    res.status(200).send(patient);
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
  const { patientId } = req.params;

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
