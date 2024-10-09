const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Visit = db.visit;
const Patient = db.patient;
const PatientProcedure = db.patientProcedure;

/**
 * Get visits for a given patientId
 * @query patientId id of the patient
 */
exports.getVisits = async (req, res) => {
  const { UserId: userId } = req.user;
  let { patientId, approved } = req.query;
  approved = approved === "true" ? true : approved === "false" ? false : null;
  let visits;

  try {
    // Find all visits of the patient
    visits = await Visit.findAll({
      attributes: [
        ["VisitId", "id"],
        ["Title", "title"],
        ["Description", "description"],
        ["Discount", "discount"],
        ["ApprovedDate", "approvedDate"],
      ],
      where: {
        ...(approved === false && { ApprovedDate: null }),
        ...(approved === true && { ApprovedDate: { [Sequelize.Op.ne]: null } }),
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [
            ["PatientId", "id"],
            ["IdNumber", "idNumber"],
            ["Name", "name"],
            ["Surname", "surname"],
            ["BirthYear", "birthYear"],
            ["Phone", "phone"],
          ],
          where: {
            UserId: userId,
            ...(patientId && { PatientId: patientId }),
          },
        },
      ],
      order: [["VisitId", "DESC"]],
      raw: true,
      nest: true,
    });

    // Find total price of patient procedures for each visit
    for (const visit of visits) {
      visit.price = await PatientProcedure.sum("Price", {
        where: {
          VisitId: visit.id,
        },
      });
    }

    res.status(200).send(visits);
    log.audit.info("Get visits completed", {
      userId,
      action: "GET",
      success: true,
      request: {
        params: req.params,
        query: req.query,
      },
      resource: {
        type: "visit",
        count: visits.length,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Add a new visit
 * @query patientId id of the patient
 * @body Visit informations along with patientProcedures
 */
exports.saveVisit = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.query;
  const { patientProcedures } = req.body;
  let patient;
  let visit;
  let pp;

  try {
    // Validation
    patient = await Patient.findOne({
      where: {
        PatientId: patientId,
        UserId: userId,
      },
    });
    if (!patient) {
      res.status(404).send({ message: "Hasta bulunamadı" });
      log.audit.warn("Save visit failed: Pateint doesn't exist", {
        userId,
        action: "POST",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "visit",
        },
      });
      return;
    }

    if (!patientProcedures || patientProcedures.length === 0) {
      res.status(400).send({ message: "Plan oluşturmak için bir işlem seçin" });
      log.audit.warn("Save visit failed: No patient procedures", {
        userId,
        action: "POST",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "visit",
        },
      });
      return;
    }

    // Create the visit
    visit = await Visit.create({ PatientId: patientId });
    // Add patient procedures to the visit
    for (const patientProcedure of patientProcedures) {
      [pp, created] = await PatientProcedure.findOrCreate({
        where: {
          PatientProcedureId: patientProcedure?.id ?? null,
        },
        defaults: {
          VisitId: visit.VisitId,
          ProcedureId: patientProcedure.procedure.id,
          ToothNumber: patientProcedure.toothNumber,
          CompletedDate: null,
          Price: patientProcedure.price,
        },
      });

      if (!created) {
        await pp.update({
          VisitId: visit.VisitId,
        });
      }
    }

    res.status(201).send({ id: visit.VisitId });
    log.audit.info("Save visit completed", {
      userId,
      action: "POST",
      success: true,
      request: {
        params: req.params,
      },
      resource: {
        type: "visit",
        id: visit.VisitId,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Update the visit
 * @param visitId id of the visit
 * @query patientId id of the patient
 * @body Visit informations
 */
exports.updateVisit = async (req, res) => {
  const { UserId: userId } = req.user;
  const { visitId } = req.query;
  const { title, description, discount, approvedDate } = req.body;
  let visit;

  try {
    // Validation
    visit = await Visit.findOne({
      where: {
        VisitId: visitId,
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [],
          where: {
            UserId: userId,
          },
        },
      ],
    });
    if (!visit) {
      res.status(404).send({ message: "Seans bulunamadı" });
      log.audit.warn("Update visit failed: Visit doesn't exist", {
        userId,
        action: "PUT",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "visit",
          id: visitId,
        },
      });
      return;
    }

    // Update the visit
    await visit.update({
      Title: title,
      Description: description,
      Discount: visit.ApprovedDate ? visit.Discount : discount ?? 0,
      ApprovedDate: approvedDate ?? null,
    });

    res.status(200).send({ id: visitId });
    log.audit.info("Update visit completed", {
      userId,
      action: "PUT",
      success: true,
      request: {
        params: req.params,
      },
      resource: {
        type: "visit",
        id: visitId,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Delete the visit
 * @param visitId id of the visit
 */
exports.deleteVisit = async (req, res) => {
  const { UserId: userId } = req.user;
  const { visitId } = req.params;
  let visit;

  try {
    // Validation
    visit = await Visit.findOne({
      where: {
        VisitId: visitId,
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: [],
          where: {
            UserId: userId,
          },
        },
      ],
    });
    if (!visit) {
      res.status(404).send({ message: "Seans bulunamadı" });
      log.audit.warn("Delete visit failed: Visit doesn't exist", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "visit",
          id: visitId,
        },
      });
      return;
    }
    if (visit.ApprovedDate) {
      res.status(400).send({ message: "Onaylanmış seans silinemez" });
      log.audit.warn("Delete visit failed: Approved visit can't be deleted", {
        userId,
        action: "DELETE",
        success: false,
        request: {
          params: req.params,
        },
        resource: {
          type: "visit",
          id: visitId,
        },
      });
      return;
    }

    // Delete the visit
    await visit.destroy();
    res.status(200).send({ id: visitId });
    log.audit.info("Delete visit completed", {
      userId,
      action: "DELETE",
      success: true,
      request: {
        params: req.params,
      },
      resource: {
        type: "visit",
        id: visitId,
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};
