const { Sequelize } = require("../models");
const db = require("../models");
const Patient = db.patient;

/**
 * Get patient list
 */
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
    res.status(500).send(error);
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
    birthYear: BirthYear,
  } = req.body;
  let values = { Name, Surname, Phone, IdNumber, BirthYear: BirthYear ?? null };
  let patient;

  try {
    // Create patient record
    patient = await Patient.create(values);

    res.status(201).send(patient);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Delete patients of the given Ids
 * If patientIds not given then delete all patients
 * @query patientId: Id list of patients
 */
exports.deletePatients = async (req, res) => {
  const { patientId } = req.query;
  let patientIds;
  let count = 0;

  try {
    // Convert query strng to array
    patientIds = patientId ? patientId.split(",") : [];

    // Delete patient records
    count = await Patient.destroy({
      where:
        patientIds.length > 0
          ? {
              PatientId: {
                [Sequelize.Op.in]: patientIds,
              },
            }
          : {},
    });

    res.status(200).send({ count: count });
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Delete the patient
 * @param patientId: Id of the patient
 */
exports.deletePatient = async (req, res) => {
  const { patientId } = req.params;
  let patient;

  try {
    // Find patient
    patient = await Patient.findOne({
      where: {
        PatientId: patientId,
      },
    });

    // Delete the patient if it exists
    if (patient) {
      await patient.destroy();

      res.status(200).send(patientId);
    } else {
      res.status(404).send(Error("Hasta bulunamadı"));
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
