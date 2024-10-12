const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Visit = db.visit;
const Patient = db.patient;
const Payment = db.payment;
const PaymentPlan = db.paymentPlan;
const PatientProcedure = db.patientProcedure;
const Notification = db.notification;
const NotificationEvent = db.notificationEvent;
const { processPatientsPayments } = require("../utils/payment.util");

const PERIOD = 30;
/**
 * Add notifications for upcoming and overdue payments of the patients
 */
exports.run = async () => {
  try {
    const recentPeriod = new Date();
    recentPeriod.setDate(recentPeriod.getDate() - PERIOD);

    // Create notificationEvent if NOT payment type events exist
    const [overdueEvent] = await NotificationEvent.findOrCreate({
      where: {
        Event: "overdue",
        Type: "payment",
      },
    });
    const [deptEvent] = await NotificationEvent.findOrCreate({
      where: {
        Event: "dept",
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
          required: false,
        },
        {
          model: Payment,
          as: "payments",
          attributes: [
            ["PaymentId", "id"],
            ["Amount", "amount"],
            ["IsPlanned", "isPlanned"],
          ],
          required: false,
        },
        {
          model: Visit,
          as: "visits",
          attributes: [
            ["VisitId", "id"],
            ["Discount", "discount"],
          ],
          where: {
            ApprovedDate: {
              [Sequelize.Op.ne]: null,
            },
          },
          required: false,
          include: [
            {
              model: PatientProcedure,
              as: "patientProcedures",
              attributes: [
                ["PatientProcedureId", "id"],
                ["Price", "price"],
              ],
              where: {
                CompletedDate: {
                  [Sequelize.Op.ne]: null,
                },
              },
            },
          ],
        },
      ],
      order: [
        [{ model: PaymentPlan, as: "paymentPlans" }, "PlannedDate", "ASC"],
        [{ model: PaymentPlan, as: "paymentPlans" }, "PaymentPlanId", "ASC"],
      ],
    });

    // Calculate overdue & upcoming status
    patients = patients.map((patient) => patient.toJSON());
    patients = processPatientsPayments(patients);

    // Create notification for overdue payments
    for (let patient of patients) {
      if (patient.overdue) {
        const existingRecord = await Notification.findOne({
          where: {
            Message: `${patient.name} ${patient.surname} isimli hastanın vadesi geçen ödemesi bulunmaktadır`,
            PatientId: patient.id,
            UserId: patient.userId,
            createdAt: { [Sequelize.Op.gte]: recentPeriod },
          },
        });
        !existingRecord &&
          (await Notification.create({
            Message: `${patient.name} ${patient.surname} isimli hastanın vadesi geçen ödemesi bulunmaktadır`,
            Status: "sent",
            PatientId: patient.id,
            UserId: patient.userId,
            NotificationEventId: overdueEvent.NotificationEventId,
          }));
      }

      if (patient.dept > 0) {
        const dept = patient.dept.toLocaleString("tr-TR", {
          style: "decimal",
          maximumFractionDigits: 2,
        });

        const existingRecord = await Notification.findOne({
          where: {
            Message: `${patient.name} ${patient.surname} isimli hastanın ₺${dept} borcu bulunmaktadır`,
            PatientId: patient.id,
            UserId: patient.userId,
            createdAt: { [Sequelize.Op.gte]: recentPeriod },
          },
        });
        !existingRecord &&
          (await Notification.create({
            Message: `${patient.name} ${patient.surname} isimli hastanın ₺${dept} borcu bulunmaktadır`,
            Status: "sent",
            PatientId: patient.id,
            UserId: patient.userId,
            NotificationEventId: deptEvent.NotificationEventId,
          }));
      }
    }

    log.app.info(
      `Service: Created notifications for ${patients.length} patients`
    );
  } catch (error) {
    log.error.error(error);
  }
};
