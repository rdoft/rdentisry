const { Sequelize } = require("../models");
const db = require("../models");
const Payment = db.payment;
const PaymentPlan = db.paymentPlan;
const Patient = db.patient;
const Notification = db.notification;
const NotificationEvent = db.notificationEvent;

const { processPatientsPayments } = require("../utils/payment.util");

/**
 * Add notifications for upcoming and overdue payments of the patients
 */
exports.run = async () => {
  try {
    // Create notificationEvent if NOT payment type events exist
    const [overdueEvent] = await NotificationEvent.findOrCreate({
      where: {
        Event: "overdue",
        Type: "payment",
      },
    });
    const [upcomingEvent] = await NotificationEvent.findOrCreate({
      where: {
        Event: "upcoming",
        Type: "payment",
      },
    });

    // Query to find all patients with their payment plans
    let patients = await Patient.findAll({
      attributes: [
        ["PatientId", "id"],
        ["UserId", "userId"],
        ["IdNumber", "idNumber"],
        ["Name", "name"],
        ["Surname", "surname"],
        ["Phone", "phone"],
        ["BirthYear", "birthYear"],
      ],
      include: [
        {
          model: PaymentPlan,
          as: "paymentPlans",
          attributes: [
            ["PaymentPlanId", "id"],
            ["Amount", "amount"],
            ["PlannedDate", "plannedDate"],
          ],
        },
      ],
      order: [
        [{ model: PaymentPlan, as: "paymentPlans" }, "PlannedDate", "ASC"],
      ],
    });

    // Query to find total planned payments per patient
    const payments = await Payment.findAll({
      attributes: [
        ["PatientId", , "patientId"],
        [Sequelize.fn("SUM", Sequelize.col("Amount")), "total"],
      ],
      where: {
        IsPlanned: true,
      },
      group: [Sequelize.col("Payment.PatientId")],
      raw: true,
    });

    // Calculate overdue & upcoming status
    patients = processPatientsPayments(patients, payments, false);

    // Create notification for overdue payments
    for (let patient of patients) {
      if (patient.overdue) {
        await Notification.create({
          Message: `${patient.name} ${patient.surname} isimli hastanın vadesi geçen ödeme planı bulunmaktadır`,
          Status: "sent",
          PatientId: patient.id,
          UserId: patient.userId,
          NotificationEventId: overdueEvent.NotificationEventId,
        });
      }

      if (patient.upcoming) {
        await Notification.create({
          Message: `${patient.name} ${patient.surname} isimli hastanın yaklaşan ödeme planı bulunmaktadır`,
          Status: "sent",
          PatientId: patient.id,
          UserId: patient.userId,
          NotificationEventId: upcomingEvent.NotificationEventId,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
