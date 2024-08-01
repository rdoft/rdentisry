const { Sequelize } = require("../models");
const db = require("../models");
const Patient = db.patient;
const Payment = db.payment;
const PaymentPlan = db.paymentPlan;

const { processPatientPayments } = require("../utils/payment.util");

/**
 * Get payment list of the given patientId
 * @param {string} patientId id of the patient
 * @query {boolean} plan whether to get payment plans or actual payments
 */
exports.getPayments = async (req, res) => {
  const { UserId: userId } = req.user;
  const { patientId } = req.params;
  const { plan } = req.query;
  let payments;

  try {
    if (plan === "true") {
      // Find payment plans of the patient
      payments = await PaymentPlan.findAll({
        attributes: [
          ["PaymentPlanId", "id"],
          ["Amount", "amount"],
          ["PlannedDate", "plannedDate"],
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
        order: [
          ["PlannedDate", "ASC"],
          ["PaymentPlanId", "ASC"],
        ],
        raw: true,
        nest: true,
      });

      // Find total paid amount
      paid = await Payment.findOne({
        attributes: [[Sequelize.fn("SUM", Sequelize.col("Amount")), "total"]],
        where: {
          IsPlanned: true,
        },
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
        group: [Sequelize.col("Payment.PatientId")],
        raw: true,
      });

      // Process the payment plans of the patient
      payments = processPatientPayments(payments, paid?.total);
    } else {
      // Find actual payments of the patient
      payments = await Payment.findAll({
        attributes: [
          ["PaymentId", "id"],
          ["Type", "type"],
          ["Amount", "amount"],
          ["ActualDate", "actualDate"],
          ["IsPlanned", "isPlanned"],
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
        order: [
          ["ActualDate", "ASC"],
          ["PaymentId", "ASC"],
        ],
        raw: true,
        nest: true,
      });
    }

    res.status(200).send(payments);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Add a Payment or Payment Plan
 * @body Payment or Payment Plan information
 * @query {boolean} plan whether to save payment plan or actual payment
 */
exports.savePayment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { plan } = req.query;
  const { patient, type, amount, plannedDate, actualDate, isPlanned } =
    req.body;
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
      return res
        .status(404)
        .send({ message: "Ödeme eklenmek istenen hasta mevcut değil" });
    }

    if (plan === "true") {
      // Create payment plan record
      payment = await PaymentPlan.create({
        PatientId: patient.id,
        Amount: amount,
        PlannedDate: plannedDate,
      });
      payment = {
        id: payment.PaymentPlanId,
        patientId: payment.PatientId,
        amount: payment.Amount,
        plannedDate: payment.PlannedDate,
      };
    } else {
      // Create actual payment record
      payment = await Payment.create({
        PatientId: patient.id,
        Type: type ?? null,
        Amount: amount,
        ActualDate: actualDate ?? new Date(),
        IsPlanned: isPlanned ?? false,
      });
      payment = {
        id: payment.PaymentId,
        patientId: payment.PatientId,
        type: payment.Type,
        amount: payment.Amount,
        actualDate: payment.ActualDate,
        isPlanned: payment.IsPlanned,
      };
    }

    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Update the Payment or Payment Plan
 * @param paymentId: Id of the Payment or Payment Plan
 * @query {boolean} plan whether to update payment plan or actual payment
 */
exports.updatePayment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { paymentId } = req.params;
  const { plan } = req.query;
  const { type, amount, plannedDate, actualDate, isPlanned } = req.body;
  let payment;

  try {
    if (plan === "true") {
      // Find the payment plan
      payment = await PaymentPlan.findOne({
        where: {
          PaymentPlanId: paymentId,
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
      if (!payment) {
        return res.status(404).send({ message: "Ödeme planı mevcut değil" });
      }

      // Update the payment plan
      await payment.update({
        Amount: amount,
        PlannedDate: plannedDate,
      });
    } else {
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
      if (!payment) {
        return res.status(404).send({ message: "Ödeme mevcut değil" });
      }

      // Update the payment
      await payment.update({
        Type: type ?? null,
        Amount: amount,
        ActualDate: actualDate ?? new Date(),
        IsPlanned: isPlanned ?? false,
      });
    }

    res.status(200).send({ id: paymentId });
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
 * Delete the Payment or Payment Plan
 * @param paymentId: Id of the Payment or Payment Plan
 */
exports.deletePayment = async (req, res) => {
  const { UserId: userId } = req.user;
  const { paymentId } = req.params;
  const { plan } = req.query;
  let payment;

  try {
    if (plan === "true") {
      // Find payment plan
      payment = await PaymentPlan.findOne({
        where: {
          PaymentPlanId: paymentId,
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

      if (!payment) {
        return res.status(404).send({ message: "Ödeme planı mevcut değil" });
      }
    } else {
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

      if (!payment) {
        return res.status(404).send({ message: "Ödeme mevcut değil" });
      }
    }

    await payment.destroy();
    res.status(200).send({ id: paymentId });
  } catch (error) {
    res.status(500).send(error);
  }
};
