const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Visit = db.visit;
const Patient = db.patient;
const Payment = db.payment;
const PaymentPlan = db.paymentPlan;
const PatientProcedure = db.patientProcedure;

const { processPatientsPayments } = require("../utils/payment.util");

/**
 * Get patient list
 */
exports.getPatients = async (req, res) => {
  const { UserId: userId } = req.user;
  const { payments } = req.query;
  const { maxPatients } = req.limit;
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
          ["IsSMS", "isSMS"],
        ],
        where: {
          UserId: userId,
        },
        include: [
          {
            model: PaymentPlan,
            as: "paymentPlans",
            attributes: [
              ["PaymentPlanId", "id"],
              ["Amount", "amount"],
              ["PlannedDate", "plannedDate"],
            ],
            required: false,
          },
          {
            model: Payment,
            as: "payments",
            attributes: [
              ["PaymentId", "id"],
              ["Amount", "amount"],
              ["IsPlanned", "isPlanned"],
            ],
            required: false,
          },
          {
            model: Visit,
            as: "visits",
            attributes: [
              ["VisitId", "id"],
              ["Discount", "discount"],
            ],
            where: {
              ApprovedDate: {
                [Sequelize.Op.ne]: null,
              },
            },
            required: false,
            include: [
              {
                model: PatientProcedure,
                as: "patientProcedures",
                attributes: [
                  ["PatientProcedureId", "id"],
                  ["Price", "price"],
                ],
                where: {
                  CompletedDate: {
                    [Sequelize.Op.ne]: null,
                  },
                },
                required: false,
              },
            ],
          },
        ],
        order: [
          ["Name", "ASC"],
          ["Surname", "ASC"],
        ],
        limit: maxPatients,
      });

      // Calculate overdue status
      patients = patients.map((patient) => patient.toJSON());
      patients = processPatientsPayments(patients);
    } else {
      patients = await Patient.findAll({
        attributes: [
          ["PatientId", "id"],
          ["IdNumber", "idNumber"],
          ["Name", "name"],
          ["Surname", "surname"],
          ["Phone", "phone"],
          ["BirthYear", "birthYear"],
          ["IsSMS", "isSMS"],
        ],
        where: {
          UserId: userId,
        },
        order: [
          ["Name", "ASC"],
          ["Surname", "ASC"],
        ],
        limit: maxPatients,
      });
    }

    res.status(200).send(patients);
    log.audit.info("Get patients completed", {
      userId,
      action: "GET",
      success: true,
      request: {
        query: req.query,
      },
      resource: {
        type: "patient",
        count: patients.length,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
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
        ["IsSMS", "isSMS"],
      ],
      where: {
        PatientId: patientId,
        UserId: userId,
      },
    });

    if (patient) {
      res.status(200).send(patient);
      log.audit.info("Get patient completed", {
        userId,
        action: "GET",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "patient",
          id: patientId,
        },
      });
    } else {
      res.status(404).send({ message: "Hasta mevcut değil" });
      log.audit.warn("Get patient failed: Patient doesn't exist ", {
        userId,
        action: "GET",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "patient",
          id: patientId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Add a patient
 * @body Patient informations
 */
exports.savePatient = async (req, res) => {
  const { UserId: userId } = req.user;
  const { idNumber, name, surname, phone, birthYear, isSMS } = req.body;
  let values = {
    Name: name,
    Surname: surname,
    Phone: phone,
    IsSMS: isSMS,
    IdNumber: idNumber ?? null,
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
      isSMS: patient.IsSMS,
    };

    res.status(201).send(patient);
    log.audit.info("Save patient completed", {
      userId,
      action: "POST",
      success: true,
      resource: {
        type: "patient",
        id: patient.id,
      },
    });
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res
        .status(400)
        .send({ message: "Hasta zaten kayıtlıdır, tekrar kaydedilemez" });
      log.audit.warn("Save patient failed: Patient already exists ", {
        userId,
        action: "POST",
        success: false,
        resource: {
          type: "patient",
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
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
  const { idNumber, name, surname, phone, birthYear, isSMS } = req.body;
  let values = {
    Name: name,
    Surname: surname,
    Phone: phone,
    IsSMS: isSMS,
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
      log.audit.info("Update patient completed", {
        userId,
        action: "PUT",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "patient",
          id: patientId,
        },
      });
    } else {
      res.status(404).send({ message: "Hasta mevcut değil" });
      log.audit.warn("Update patient failed: Patient doesn't exist ", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "patient",
          id: patientId,
        },
      });
    }
  } catch (error) {
    if (
      error instanceof Sequelize.ValidationError &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      res
        .status(400)
        .send({ message: "Hasta zaten kayıtlıdır, tekrar kaydedilemez" });
      log.audit.warn("Update patient failed: Patient already exists ", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "patient",
          id: patientId,
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};

/**
 * Update the patient's permission
 * @query patientId: Id list of the patient
 * @body Permission informations
 */
exports.updatePatientsPermission = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.query;
  const { isSMS } = req.body;
  let patientIds;
  let count = 0;

  try {
    // Convert query string to array
    patientIds = patientId ? patientId.split(",") : [];

    // Update patient records
    if (patientIds.length > 0) {
      [count] = await Patient.update(
        {
          IsSMS: isSMS,
        },
        {
          where: {
            UserId: userId,
            PatientId: {
              [Sequelize.Op.in]: patientIds,
            },
          },
        }
      );
    }

    res.status(200).send({ count: count });
    log.audit.info("Update patients permission completed", {
      userId,
      action: "PUT",
      success: true,
      request: {
        query: req.query,
        body: req.body,
      },
      resource: {
        type: "patient",
        count: count,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({ message: error.message });
      log.audit.error("Update patients permission failed: Validation error", {
        userId,
        action: "PUT",
        success: false,
        request: {
          query: req.query,
          body: req.body,
        },
        resource: {
          type: "patient",
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};

/**
 * Delete patients of the given Ids
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
    if (patientIds.length > 0) {
      count = await Patient.destroy({
        where: {
          UserId: userId,
          PatientId: {
            [Sequelize.Op.in]: patientIds,
          },
        },
      });
    }

    res.status(200).send({ count: count });
    log.audit.info("Delete patients completed", {
      userId,
      action: "DELETE",
      success: true,
      request: {
        query: req.query,
      },
      resource: {
        type: "patient",
        count: count,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({ message: error.message });
      log.audit.error("Delete patients failed: Validation error", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          query: req.query,
        },
        resource: {
          type: "patient",
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
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
      log.audit.info("Delete patient completed", {
        userId,
        action: "DELETE",
        success: true,
        request: {
          params: req.params,
        },
        resource: {
          type: "patient",
          id: patientId,
        },
      });
    } else {
      res.status(404).send({ message: "Hasta mevcut değil" });
      log.audit.warn("Delete patient failed: Patient doesn't exist", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "patient",
          id: patientId,
        },
      });
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({ message: error.message });
      log.audit.error("Delete patient failed: Validation error", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "patient",
          id: patientId,
        },
      });
    } else {
      res.status(500).send(error);
      log.error.error(error);
    }
  }
};
