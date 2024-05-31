const { Sequelize } = require("../models");
const db = require("../models");

const Payment = db.payment;
const PaymentPlan = db.paymentPlan;
const Patient = db.patient;
const Notification = db.notification;
const NotificationEvent = db.notificationEvent;

const UPCOMMING = 2; // Days of upcoming payment

/**
 * Add notifications for upcoming and overdue payments of the patients
 */
exports.run = async () => {
  let overdueEvent;
  let upcomingEvent;
  const overduePatients = [];
  const upcomingPatients = [];
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + UPCOMMING);

  try {
    // Create notificationEvent if NOT payment type events exist
    [overdueEvent] = await NotificationEvent.findOrCreate({
      where: {
        Event: "overdue",
        Type: "payment",
      },
    });
    [upcomingEvent] = await NotificationEvent.findOrCreate({
      where: {
        Event: "upcoming",
        Type: "payment",
      },
    });

    // Query to find all patients with their payment plans
    const patients = await Patient.findAll({
      include: [
        {
          model: PaymentPlan,
          as: "paymentPlans",
          attributes: ["Amount", "PlannedDate"],
          required: false,
        },
      ],
      order: [
        [{ model: PaymentPlan, as: "paymentPlans" }, "PlannedDate", "ASC"],
      ],
    });

    // Query to find total planned payments per patient
    const payments = await Payment.findAll({
      attributes: [
        "PatientId",
        [Sequelize.fn("SUM", Sequelize.col("Amount")), "total"],
      ],
      where: {
        IsPlanned: true,
      },
      group: ["PatientId"],
      raw: true,
    });
    // Create a map of patientId to total planned payment amount
    const paymentMap = {};
    for (const payment of payments) {
      paymentMap[payment.PatientId] = payment.total;
    }

    for (const patient of patients) {
      let paymentPlans = patient.paymentPlans;
      let totalPaid = paymentMap[patient.PatientId] || 0;

      // Reduce the paymentPlans as much as payments amount
      for (let i = 0; i < paymentPlans.length && totalPaid > 0; i++) {
        if (paymentPlans[i].Amount <= totalPaid) {
          totalPaid -= paymentPlans[i].Amount;
          paymentPlans[i].Amount = 0; // Fully reduced
        } else {
          paymentPlans[i].Amount -= totalPaid;
          totalPaid = 0; // Fully reduced
        }
      }

      // Filter out fully reduced payment plans
      // Control if there is any paymentPlan left and its plannedDate is today or upcoming
      paymentPlans = paymentPlans.filter((plan) => plan.Amount > 0);

      if (
        paymentPlans.some(
          (plan) =>
            new Date(plan.PlannedDate).setHours(0, 0, 0, 0) ===
            today.setHours(0, 0, 0, 0)
        )
      ) {
        overduePatients.push(patient);
      }
      if (
        paymentPlans.some(
          (plan) =>
            new Date(plan.PlannedDate).setHours(0, 0, 0, 0) ===
            tomorrow.setHours(0, 0, 0, 0)
        )
      ) {
        upcomingPatients.push(patient);
      }
    }

    // Create notification for overdue payments
    for (let patient of overduePatients) {
      await Notification.create({
        Message: `${patient.Name} ${patient.Surname} isimli hastanın vadesi geçen ödeme planı bulunmaktadır`,
        Status: "sent",
        PatientId: patient.PatientId,
        UserId: patient.UserId,
        NotificationEventId: overdueEvent.NotificationEventId,
      });
    }

    // Create notification for upcoming payments
    for (let patient of upcomingPatients) {
      await Notification.create({
        Message: `${patient.Name} ${patient.Surname} isimli hastanın yaklaşan ödeme planı bulunmaktadır`,
        Status: "sent",
        PatientId: patient.PatientId,
        UserId: patient.UserId,
        NotificationEventId: upcomingEvent.NotificationEventId,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
