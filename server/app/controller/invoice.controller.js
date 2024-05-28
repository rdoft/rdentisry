const { Sequelize } = require("../models");
const db = require("../models");
const Invoice = db.invoice;
const Patient = db.patient;
const PatientProcedure = db.patientProcedure;

/**
 * Add a new invoice
 * @body Invoice informations along with patientProcedures
 */
exports.saveInvoice = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  const { patientProcedures } = req.body;
  let patient;
  let invoice;
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
      res.status(404).send({ message: "Bu kullanıcıya ait hasta bulunamadı" });
      return;
    }

    if (!patientProcedures || patientProcedures.length === 0) {
      res.status(400).send({ message: "Plan oluşturmak için bir işlem seçin" });
      return;
    }

    // Create the invoice
    invoice = await Invoice.create({});

    // Add patient procedures to the invoice
    for (const patientProcedure of patientProcedures) {
      pp = await PatientProcedure.findOne({
        where: {
          PatientProcedureId: patientProcedure.id,
        },
      });

      if (pp) {
        await pp.update({
          InvoiceId: invoice.InvoiceId,
        });
      }
    }

    res.status(201).send({ id: invoice.InvoiceId });
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Update the invoice
 * @param patientId id of the patient
 * @param invoiceId id of the invoice
 * @body Invoice informations
 */
exports.updateInvoice = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId, invoiceId } = req.params;
  const { title, description, discount, date } = req.body;
  let patient;
  let invoice;

  try {
    // Validation
    patient = await Patient.findOne({
      where: {
        PatientId: patientId,
        UserId: userId,
      },
    });
    if (!patient) {
      res.status(404).send({ message: "Bu kullanıcıya ait hasta bulunamadı" });
      return;
    }

    // Update the invoice
    invoice = await Invoice.findByPk(invoiceId);
    if (invoice) {
      await invoice.update({
        Title: title,
        Description: description,
        Discount: discount ?? 0,
        Date: date ?? new Date(),
      });

      res.status(200).send({ id: invoiceId });
    } else {
      res.status(404).send({ message: "Aşama bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Delete the invoice
 * @param invoiceId id of the invoice
 * @param patientId id of the patient
 */
exports.deleteInvoice = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId, invoiceId } = req.params;
  let invoice;
  let patient;

  try {
    // Validation
    patient = await Patient.findOne({
      where: {
        PatientId: patientId,
        UserId: userId,
      },
    });
    if (!patient) {
      res.status(404).send({ message: "Bu kullanıcıya ait hasta bulunamadı" });
      return;
    }

    // Delete the invoice
    invoice = await Invoice.findOne({
      where: {
        InvoiceId: invoiceId,
      },
    });
    if (invoice) {
      await invoice.destroy();

      res.status(200).send({ id: invoiceId });
    } else {
      res.status(404).send({ message: "Aşama bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
