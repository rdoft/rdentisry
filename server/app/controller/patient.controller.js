const { Sequelize } = require("../models");
const db = require("../models");
const Patient = db.patient;
const Payment = db.payment;

/**
 * Get patient list
 */
exports.getPatients = async (req, res) => {
  const { UserId: userId } = req.user;
  const { payments } = req.query;
  let patients;

  try {
    // Find patient list
    if (payments === "true") {
      patients = await Patient.findAll({
        attributes: [
          ["PatientId", "id"],
          ["IdNumber", "idNumber"],
          ["Name", "name"],
          ["Surname", "surname"],
          ["Phone", "phone"],
          ["BirthYear", "birthYear"],
        ],
        where: {
          UserId: userId,
        },
        include: [
          {
            model: Payment,
            as: "payments",
            attributes: [
              ["PaymentId", "id"],
              ["Amount", "amount"],
              ["ActualDate", "actualDate"],
              ["PlannedDate", "plannedDate"],
            ],
          },
        ],
        order: [
          ["Name", "ASC"],
          ["Surname", "ASC"],
        ],
      });
      patients = JSON.parse(JSON.stringify(patients));

      // Control overdue status
      for (let patient of patients) {
        patient.payments.find(
          (payment) =>
            !payment.actualDate && new Date(payment.plannedDate) < new Date()
        )
          ? (patient.overdue = true)
          : (patient.overdue = false);
      }
    } else {
      patients = await Patient.findAll({
        attributes: [
          ["PatientId", "id"],
          ["IdNumber", "idNumber"],
          ["Name", "name"],
          ["Surname", "surname"],
          ["Phone", "phone"],
          ["BirthYear", "birthYear"],
        ],
        where: {
          UserId: userId,
        },
        order: [
          ["Name", "ASC"],
          ["Surname", "ASC"],
        ],
      });
    }

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
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  let patient;

  try {
    // Find the patient record
    patient = await Patient.findOne({
      attributes: [
        ["PatientId", "id"],
        ["IdNumber", "idNumber"],
        ["Name", "name"],
        ["Surname", "surname"],
        ["BirthYear", "birthYear"],
        ["Phone", "phone"],
      ],
      where: {
        PatientId: patientId,
        UserId: userId,
      },
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
  const { UserId: userId } = req.user;
  const { idNumber, name, surname, phone, birthYear } = req.body;
  let values = {
    Name: name,
    Surname: surname,
    Phone: phone,
    IdNumber: idNumber,
    BirthYear: birthYear ?? null,
    UserId: userId,
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
  const { UserId: userId } = req.user;
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
    patient = await Patient.findOne({
      where: {
        PatientId: patientId,
        UserId: userId,
      },
    });

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
  const { UserId: userId } = req.user;
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
              UserId: userId,
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
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  let patient;

  try {
    // Find patient
    patient = await Patient.findOne({
      where: {
        PatientId: patientId,
        UserId: userId,
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
