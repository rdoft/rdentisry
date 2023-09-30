const { Sequelize } = require("../models");
const db = require("../models");

const Payment = db.payment;
const Patient = db.patient;
const Notification = db.notification;
const NotificationEvent = db.notificationEvent;

const UPCOMMING = 2;

/**
 * Add notifications for upcoming and overdue payments of the patients
 */
exports.run = async () => {
  let overdueEvent;
  let upcomingEvent;
  let overduePatients;
  let upcomingPatients;
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + UPCOMMING);

  try {
    // Create notificaitonEvent if NOT payment type events exist
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

    // Find overdue payment of the patients
    overduePatients = await Patient.findAll({
      include: [
        {
          model: Payment,
          as: "payments",
          where: {
            PlannedDate: {
              [Sequelize.Op.eq]: today,
            },
            ActualDate: null,
          },
        },
      ],
    });
    // Find upcomming payments of the patients
    upcomingPatients = await Patient.findAll({
      include: [
        {
          model: Payment,
          as: "payments",
          where: {
            PlannedDate: {
              [Sequelize.Op.eq]: tomorrow,
            },
            ActualDate: null,
          },
        },
      ],
    });

    // Create notification for overdue payments
    for (let patient of overduePatients) {
      await Notification.create({
        Message: `${patient.Name} ${patient.Surname} isimli hastanın vadesi geçen ödemesi bulunmaktadır`,
        Status: "sent",
        PatientId: patient.PatientId,
        NotificationEventId: overdueEvent.NotificationEventId,
      });
    }
    // Create notification for upcoming payments
    for (let patient of upcomingPatients) {
      await Notification.create({
        Message: `${patient.Name} ${patient.Surname} isimli hastanın yaklaşan ödemesi bulunmaktadır`,
        Status: "sent",
        PatientId: patient.PatientId,
        NotificationEventId: upcomingEvent.NotificationEventId,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
