const { Sequelize } = require("../models");
const db = require("../models");
const Visit = db.visit;
const Patient = db.patient;
const PatientProcedure = db.patientProcedure;

/**
 * Get visits for a given patientId
 * @param patientId id of the patient
 */
exports.getVisits = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  let { approved } = req.query;
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

    res.status(200).send(visits);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a new visit
 * @body Visit informations along with patientProcedures
 */
exports.saveVisit = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
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
      return;
    }

    if (!patientProcedures || patientProcedures.length === 0) {
      res.status(400).send({ message: "Plan oluşturmak için bir işlem seçin" });
      return;
    }

    // Create the visit
    visit = await Visit.create({ PatientId: patientId });

    // Add patient procedures to the visit
    for (const patientProcedure of patientProcedures) {
      pp = await PatientProcedure.findOne({
        where: {
          PatientProcedureId: patientProcedure.id,
        },
      });

      if (pp) {
        await pp.update({
          VisitId: visit.VisitId,
        });
      }
    }

    res.status(201).send({ id: visit.VisitId });
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Update the visit
 * @param patientId id of the patient
 * @param visitId id of the visit
 * @body Visit informations
 */
exports.updateVisit = async (req, res) => {
  const { UserId: userId } = req.user;
  const { visitId } = req.params;
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
      res.status(404).send({ message: "Ziyaret bulunamadı" });
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
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Delete the visit
 * @param visitId id of the visit
 * @param patientId id of the patient
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
      res.status(404).send({ message: "Ziyaret bulunamadı" });
      return;
    }
    if (visit.ApprovedDate) {
      res.status(400).send({ message: "Onaylanmış ziyaret silinemez" });
      return;
    }

    // Delete the visit
    await visit.destroy();
    res.status(200).send({ id: visitId });
  } catch (error) {
    res.status(500).send(error);
  }
};
