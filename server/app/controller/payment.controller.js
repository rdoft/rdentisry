const { Sequelize } = require("../models");
const db = require("../models");
const Payment = db.payment;
const Patient = db.patient;

/**
 * Get payment list of the given patientId
 * @param {string} patientId id of the patient
 */
exports.getPayments = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  let payments;

  try {
    // Find notes of the patient
    payments = await Payment.findAll({
      attributes: [
        ["PaymentId", "id"],
        ["Type", "type"],
        ["Amount", "amount"],
        ["ActualDate", "actualDate"],
        ["PlannedDate", "plannedDate"],
      ],
      order: [
        ["ActualDate", "ASC"],
        ["PlannedDate", "ASC"],
      ],
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
      raw: true,
      nest: true,
    });

    res.status(200).send(payments);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a Payment
 * @body Payment information
 */
exports.savePayment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patient, type, amount, plannedDate, actualDate } = req.body;
  let values = {
    PatientId: patient.id,
    Type: type ?? null,
    Amount: amount,
    PlannedDate: plannedDate ?? null,
    ActualDate: actualDate ?? null,
  };
  let payment;

  try {
    // Find the patient and control if it belongs to the authenticated user
    const patientRecord = await Patient.findOne({
      where: {
        PatientId: patient.id,
        UserId: userId,
      },
    });
    
    if (!patientRecord) {
      return res.status(404).send({ message: "Böyle bir hasta bulunamadı" });
    }

    // Create payment record
    payment = await Payment.create(values);
    payment = {
      id: payment.PaymentId,
      patientId: payment.PatientId,
      type: payment.Type,
      amount: payment.Amount,
      plannedDate: payment.PlannedDate,
      actualDate: payment.ActualDate,
    };

    res.status(200).send(payment);
  } catch (error) {
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      res.status(400).send({
        message: "Ödeme eklenmek istenen hasta mevcut değil",
      });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Update the Payment
 * @param paymentId: Id of the Payment
 */
exports.updatePayment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { paymentId } = req.params;
  const { patient, type, amount, plannedDate, actualDate } = req.body;
  let values = {
    PatientId: patient.id,
    Type: type ?? null,
    Amount: amount,
    PlannedDate: plannedDate ?? null,
    ActualDate: actualDate ?? null,
  };
  let payment;

  try {
    // Find the payment
    payment = await Payment.findOne({
      where: {
        PaymentId: paymentId,
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

    if (payment) {
      // Update the payment
      await payment.update(values);

      res.status(200).send({ id: paymentId });
    } else {
      res.status(404).send({ message: "Böyle bir ödeme kaydı mevcut değil" });
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).send({
        message: "Ödeme negatif bir sayı olamaz",
      });
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * Delete the Payment
 * @param paymentId: Id of the Payment
 */
exports.deletePayment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { paymentId } = req.params;
  let payment;

  try {
    // Find payment
    payment = await Payment.findOne({
      where: {
        PaymentId: paymentId,
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

    if (payment) {
      payment.destroy();

      res.status(200).send({ id: paymentId });
    } else {
      res.status(404).send({ message: "Ödeme kaydı bulunamadı" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
