const { Sequelize } = require("../models");
const db = require("../models");
const Invoice = db.invoice;
const Patient = db.patient;

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
      res.status(404).send({ message: "Bu kullanıcıya ait aşama bulunamadı" });
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
      res.status(404).send({ message: "Bu kullanıcıya ait aşama bulunamadı" });
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
