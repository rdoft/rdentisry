const { Sequelize } = require("../models");
const db = require("../models");
const Patient = db.patient;
const Visit = db.visit;
const Procedure = db.procedure;
const PatientProcedure = db.patientProcedure;
const ProcedureCategory = db.procedureCategory;

/**
 * Get the procedures of the selected visit
 * @param patientId id of the patient
 * @query tooth: number of the tooth
 * @query completed: flag for completed/noncompleted
 */
exports.getPatientProcedures = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  let { tooth, completed } = req.query;
  completed =
    completed === "true" ? true : completed === "false" ? false : null;
  let visits;

  try {
    visits = await PatientProcedure.findAll({
      attributes: [
        ["PatientProcedureId", "id"],
        ["VisitId", "visitId"],
        ["ToothNumber", "toothNumber"],
        ["CompletedDate", "completedDate"],
        ["Price", "price"],
      ],
      where: {
        ...(tooth && { ToothNumber: tooth }),
        ...(completed === false && { CompletedDate: null }),
        ...(completed === true && {
          CompletedDate: { [Sequelize.Op.ne]: null },
        }),
      },
      include: [
        {
          model: Visit,
          as: "visit",
          attributes: [
            ["VisitId", "id"],
            ["Title", "title"],
            ["Description", "description"],
            ["Discount", "discount"],
            ["ApprovedDate", "approvedDate"],
          ],
          include: [
            {
              model: Patient,
              as: "patient",
              attributes: [],
              where: {
                UserId: userId,
                ...(patientId && { PatientId: patientId }),
              },
            },
          ],
          required: true,
        },
        {
          model: Procedure,
          as: "procedure",
          attributes: [
            ["ProcedureId", "id"],
            ["Code", "code"],
            ["Name", "name"],
            ["Price", "price"],
          ],
          include: [
            {
              model: ProcedureCategory,
              as: "procedureCategory",
              attributes: [
                ["ProcedureCategoryId", "id"],
                ["Title", "title"],
              ],
            },
          ],
        },
      ],
      order: [
        ["VisitId", "ASC"],
        ["PatientProcedureId", "ASC"],
      ],
    });

    res.status(200).send(visits);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a procedure to the patient
 * @body PatientProcedure informations
 */
exports.savePatientProcedure = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  const { toothNumber, procedure, visit, price } = req.body;
  let patient;
  let procedure_;
  let patientProcedure;
  let visit_;

  try {
    // Validations
    patient = await Patient.findOne({
      where: {
        PatientId: patientId,
        UserId: userId,
      },
    });
    if (!patient) {
      return res.status(404).send({ message: "Hasta mevcut değil" });
    }

    procedure_ = await Procedure.findOne({
      where: {
        ProcedureId: procedure.id,
        UserId: userId,
      },
    });
    if (!procedure_) {
      return res.status(404).send({ message: "Tedavi mevcut değil" });
    }

    // Visit record will be created if it does not exist
    [visit_] = await Visit.findOrCreate({
      where: {
        VisitId: visit?.id ?? null,
      },
      defaults: {
        PatientId: patientId,
      },
    });

    // Create patient procedure record
    patientProcedure = await PatientProcedure.create({
      VisitId: visit_.VisitId,
      ProcedureId: procedure.id,
      ToothNumber: toothNumber,
      CompletedDate: null,
      Price: price,
    });

    // Return the created patient procedure
    patientProcedure = {
      id: patientProcedure.PatientProcedureId,
      visitId: patientProcedure.VisitId,
      procedureId: patientProcedure.ProcedureId,
      toothNumber: patientProcedure.ToothNumber,
      completedDate: patientProcedure.CompletedDate,
      price: patientProcedure.Price,
      visit: {
        id: visit_.VisitId,
        title: visit_.Title,
        description: visit_.Description,
        discount: visit_.Discount,
        approvedDate: visit_.ApprovedDate,
      },
    };
    res.status(201).send(patientProcedure);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Update a procedure of the patient
 * @param patientProcedureId id of the patientprocedure
 * @body tooth and procedure informations
 */
exports.updatePatientProcedure = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientProcedureId, patientId } = req.params;
  const { toothNumber, completedDate, visit, price } = req.body;
  let patientProcedure;
  let visit_;

  try {
    // Validations
    patientProcedure = await PatientProcedure.findOne({
      where: {
        PatientProcedureId: patientProcedureId,
      },
      include: [
        {
          model: Procedure,
          as: "procedure",
          attributes: [],
          where: {
            UserId: userId,
          },
        },
        {
          model: Visit,
          as: "visit",
          attributes: ["VisitId", "ApprovedDate"],
          include: [
            {
              model: Patient,
              as: "patient",
              attributes: ["PatientId"],
              where: {
                UserId: userId,
              },
            },
          ],
        },
      ],
    });

    if (patientProcedure) {
      // Visit record will be created if it does not exist
      [visit_] = await Visit.findOrCreate({
        where: {
          VisitId: visit?.id ?? null,
        },
        defaults: {
          PatientId: patientId,
        },
      });

      // Update patient procedure record
      await patientProcedure.update({
        ToothNumber: toothNumber,
        VisitId: visit_.VisitId,
        CompletedDate: completedDate ?? null,
        Price: price,
      });

      res.status(200).send({ id: patientProcedureId });
    } else {
      res.status(404).send({ message: "Tedavi veya hasta mevcut değil" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Delete the procedure
 * @param patientProcedureId: id of the patientProcedure
 */
exports.deletePatientProcedure = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientProcedureId } = req.params;
  let patientProcedure;

  try {
    // Find patientProcedure
    patientProcedure = await PatientProcedure.findOne({
      where: {
        PatientProcedureId: patientProcedureId,
      },
      include: [
        {
          model: Procedure,
          as: "procedure",
          attributes: [],
          where: {
            UserId: userId,
          },
        },
        {
          model: Visit,
          as: "visit",
          attributes: ["ApprovedDate"],
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
        },
      ],
    });

    // Delete the patientProcedure if it exists and visit is not approved
    if (!patientProcedure) {
      return res.status(404).send({ message: "Tedavi mevcut değil" });
    }
    if (patientProcedure.visit.ApprovedDate) {
      return res.status(400).send({
        message: "Onaylanmış bir ziyaret için değişiklik yapılamaz",
      });
    }
    await patientProcedure.destroy();

    res.status(200).send({ id: patientProcedureId });
  } catch (error) {
    res.status(500).send(error);
  }
};
