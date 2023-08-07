const { Sequelize } = require("../models");
const db = require("../models");
const Patient = db.patient;
const Procedure = db.procedure;
const PatientProcedure = db.patientProcedure;

/**
 * Get patient list
 */
exports.getPatients = async (req, res) => {
  let patients;

  try {
    // Find patient list
    patients = await Patient.findAll({
      attributes: [
        ["PatientId", "id"],
        ["IdNumber", "idNumber"],
        ["Name", "name"],
        ["Surname", "surname"],
        ["Phone", "phone"],
        ["BirthYear", "birthYear"],
      ],
    });

    res.status(200).send(patients);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Get the patient with given id
 * @param patientId id of the patient
 */
exports.getPatient = async (req, res) => {
  const { patientId } = req.params;
  let patient;

  try {
    // Find the patient record
    patient = await Patient.findByPk(patientId, {
      attributes: [
        ["PatientId", "id"],
        ["IdNumber", "idNumber"],
        ["Name", "name"],
        ["Surname", "surname"],
        ["BirthYear", "birthYear"],
        ["Phone", "phone"],
      ],
    });

    if (patient) {
      res.status(200).send(patient);
    } else {
      res.status(404).send({ message: "Hasta bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a patient
 * @body Patient informations
 */
exports.savePatient = async (req, res) => {
  const { idNumber, name, surname, phone, birthYear } = req.body;
  let values = {
    Name: name,
    Surname: surname,
    Phone: phone,
    IdNumber: idNumber,
    BirthYear: birthYear ?? null,
  };
  let patient;

  try {
    // Create patient record
    patient = await Patient.create(values);
    patient = {
      id: patient.PatientId,
      idNumber: patient.IdNumber,
      name: patient.Name,
      surname: patient.Surname,
      phone: patient.Phone,
      birthYear: patient.BirthYear,
    };
    res.status(201).send(patient);
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res
        .status(400)
        .send({ message: "Hasta zaten kayıtlıdır, tekrar kaydedilemez" });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Update the patient
 * @param patientId id of the patient
 * @body Patient informations
 */
exports.updatePatient = async (req, res) => {
  const { patientId } = req.params;
  const { idNumber, name, surname, phone, birthYear } = req.body;
  let values = {
    Name: name,
    Surname: surname,
    Phone: phone,
    IdNumber: idNumber ?? null,
    BirthYear: birthYear ?? null,
  };
  let patient;

  try {
    // Find the patient record
    patient = await Patient.findByPk(patientId);

    if (patient) {
      // Update patient record
      await patient.update(values);

      res.status(200).send({ id: patientId });
    } else {
      res.status(404).send({ message: "Böyle bir hasta mevcut değil" });
    }
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res
        .status(400)
        .send({ message: "Hasta zaten kayıtlıdır, tekrar kaydedilemez" });
    } else {
      res.status(500).send(error);
    }
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
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      res.status(400).send({
        message:
          "Silmek istediğiniz hastalara ait ödeme kaydı olduğundan işlem tamamlanamadı",
      });
    } else {
      res.status(500).send(error);
    }
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

      res.status(200).send({ id: patientId });
    } else {
      res.status(404).send({ message: "Hasta bulunamadı" });
    }
  } catch (error) {
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      res.status(400).send({
        message:
          "Silmek istediğiniz hastaya ait ödeme kaydı olduğundan işlem tamamlanamadı",
      });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Get the procedures of the selected patient
 * @param patientId id of the patient
 * @query tooth: number of the tooth
 * @query completed: flag for completed/noncompleted
 */
exports.getPatientProcedures = async (req, res) => {
  const { patientId } = req.params;
  let { tooth, completed } = req.query;
  completed =
    completed === "true" ? true : completed === "false" ? false : null;
  let patient;

  try {
    patient = await Patient.findByPk(patientId, {
      attributes: [
        ["PatientId", "id"],
        ["IdNumber", "idNumber"],
        ["Name", "name"],
        ["Surname", "surname"],
        ["BirthYear", "birthYear"],
        ["Phone", "phone"],
      ],
      include: [
        {
          model: PatientProcedure,
          as: "patientProcedures",
          attributes: [
            ["PatientProcedureId", "id"],
            ["ToothNumber", "toothNumber"],
            ["IsComplete", "isComplete"],
          ],
          where: {
            ...(tooth && { ToothNumber: tooth }),
            ...(completed && { IsComplete: completed }),
          },
          include: [
            {
              model: Procedure,
              as: "procedure",
              attributes: [
                ["ProcedureId", "id"],
                ["Code", "code"],
                ["Name", "name"],
                ["Price", "price"],
              ],
            },
          ],
        },
      ],
    });

    if (patient) {
      res.status(200).send(patient.toJSON());
    } else {
      res.status(404).send([]);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a procedure to the patient
 * @body PatientProcedure informations
 */
exports.savePatientProcedure = async (req, res) => {
  const { patientId } = req.params;
  const { procedureId, toothNumber } = req.body;
  let values = {
    PatientId: patientId,
    ProcedureId: procedureId,
    ToothNumber: toothNumber,
    IsComplete: false,
  };
  let patient;
  let procedure;
  let patientProcedure;

  try {
    patient = await Patient.findByPk(patientId);
    if (!patient) {
      res.status(404).send({ message: "Böyle bir hasta mevcut değil" });
    }

    procedure = await Procedure.findByPk(procedureId);
    if (!procedure) {
      res.status(404).send({ message: "Böyle bir işlem mevcut değil" });
    }

    // Create Appointment record
    patientProcedure = await PatientProcedure.create(values);
    patientProcedure = {
      id: patientProcedure.PatientProcedureId,
      patientId: patientProcedure.PatientId,
      procedureId: patientProcedure.ProcedureId,
      toothNumber: patientProcedure.ToothNumber,
      isComplete: patientProcedure.IsComplete,
    };
    res.status(201).send(patientProcedure);
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).send({
        message:
          "Aynı işlem, bir hastanın aynı dişine birden fazla kez girilemez",
      });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Delete the procedure
 * @param patientProcedureId: id of the patientProcedure
 */
exports.deletePatientProcedure = async (req, res) => {
  const { patientProcedureId } = req.params;
  let patientProcedure;

  try {
    // Find patientProcedure
    patientProcedure = await PatientProcedure.findByPk(patientProcedureId);

    // Delete the patientProcedure if it exists
    if (patientProcedure) {
      await patientProcedure.destroy();

      res.status(200).send({ id: patientProcedureId });
    } else {
      res.status(404).send({ message: "İşlem kaydı bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
