const { Sequelize } = require("../models");
const db = require("../models");
const Patient = db.patient;
const Invoice = db.invoice;
const Procedure = db.procedure;
const PatientProcedure = db.patientProcedure;
const ProcedureCategory = db.procedureCategory;

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
            {
              model: Invoice,
              as: "invoice",
              attributes: [
                ["InvoiceId", "id"],
                ["Amount", "amount"],
                ["Description", "description"],
                ["Discount", "discount"],
              ],
            },
          ],
        },
      ],
    });

    if (patient) {
      res.status(200).send(patient.patientProcedures);
    } else {
      res.status(200).send([]);
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
  const { toothNumber, procedure, invoice } = req.body;
  let patient;
  let procedure_;
  let patientProcedure;
  let invoice_;

  try {
    // Check validations
    patient = await Patient.findByPk(patientId);
    if (!patient) {
      res.status(404).send({ message: "Böyle bir hasta mevcut değil" });
    }

    procedure_ = await Procedure.findByPk(procedure.id);
    if (!procedure_) {
      res.status(404).send({ message: "Böyle bir işlem mevcut değil" });
    }

    // Create patient procedure record
    patientProcedure = await PatientProcedure.create({
      PatientId: patientId,
      ProcedureId: procedure.id,
      ToothNumber: toothNumber,
      IsComplete: false,
    });

    // Create invoice record
    invoice_ = await Invoice.create({
      PatientProcedureId: patientProcedure.PatientProcedureId,
      Amount: invoice.amount,
      Description: invoice.description,
      Discount: invoice.discount,
    });

    // Return the created patient procedure
    patientProcedure = {
      id: patientProcedure.PatientProcedureId,
      patientId: patientProcedure.PatientId,
      procedureId: patientProcedure.ProcedureId,
      toothNumber: patientProcedure.ToothNumber,
      isComplete: patientProcedure.IsComplete,
      invoice: {
        id: invoice_.InvoiceId,
        amount: invoice_.Amount,
        description: invoice_.Description,
        Discount: invoice_.Discount,
      },
    };
    res.status(201).send(patientProcedure);
  } catch (error) {
    res.status(500).send(error);
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
