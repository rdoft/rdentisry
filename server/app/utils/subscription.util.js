const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const Doctor = db.doctor;
const Patient = db.patient;
const Note = db.note;
const Appointment = db.appointment;
const Notification = db.notification;
const Payment = db.payment;
const PaymentPlan = db.paymentPlan;
const PatientProcedure = db.patientProcedure;
const Visit = db.visit;

// TODO: Add functions to calculate the remaining features (SMS and all)
// TODO: Add these calculations for necessary parts of the application

/**
 * Calculate the remaining doctors for the subscription
 * @param {number} userId - The user's id
 * @param {number} maxDoctorCount - The maximum number of doctors based on pricing
 * @return {number} - The remaining doctors
 */
async function calcRemainingDoctors(userId, maxDoctorCount) {
  const user = await User.findByPk(userId);
  if (!user) {
    log.app.error(`Calculate remaining doctors failed: User not found`, {
      success: false,
      userId: userId,
    });
    throw new Error("Kullanıcı mevcut değil");
  }

  const doctorCount = await Doctor.count({ where: { UserId: userId } });
  return Math.max(0, maxDoctorCount - doctorCount);
}

/**
 * Calculate the remaining patients for the subscription
 * @param {number} userId - The user's id
 * @param {number} maxPatientCount - The maximum number of patients based on pricing
 * @return {number} - The remaining patients
 */
async function calcRemainingPatients(userId, maxPatientCount) {
  const user = await User.findByPk(userId);
  if (!user) {
    log.app.error(`Calculate remaining patients failed: User not found`, {
      success: false,
      userId: userId,
    });
    throw new Error("Kullanıcı mevcut değil");
  }

  const patientCount = await Patient.count({ where: { UserId: userId } });
  return Math.max(0, maxPatientCount - patientCount);
}

/**
 * Calculate the remaining storage for the subscription
 * @param {number} userId - The user's id
 * @param {number} maxStorageSize - The maximum storage size based on pricing
 * @return {number} - The remaining storage in MB
 */
async function calcRemainingStorage(userId, maxStorageSize) {
  const user = await User.findByPk(userId);
  if (!user) {
    log.app.error(`Calculate remaining storage failed: User not found`, {
      success: false,
      userId: userId,
    });
    throw new Error("Kullanıcı mevcut değil");
  }

  const patientCount = await Patient.count({
    where: { UserId: userId },
  });
  const notificationCount = await Notification.count({
    where: { UserId: userId },
  });
  const appointmentCount = await Appointment.count({
    include: [
      {
        model: Patient,
        as: "patient",
        where: { UserId: userId },
      },
    ],
  });
  const noteCount = await Note.count({
    include: [
      {
        model: Patient,
        as: "patient",
        where: { UserId: userId },
      },
    ],
  });
  const paymentCount = await Payment.count({
    include: [
      {
        model: Patient,
        as: "patient",
        where: { UserId: userId },
      },
    ],
  });
  const paymentPlanCount = await PaymentPlan.count({
    include: [
      {
        model: Patient,
        as: "patient",
        where: { UserId: userId },
      },
    ],
  });
  const patientProcedureCount = await PatientProcedure.count({
    include: [
      {
        model: Visit,
        as: "visit",
        include: [
          {
            model: Patient,
            as: "patient",
            where: { UserId: userId },
          },
        ],
      },
    ],
  });

  const storageSize =
    0.001 * patientCount +
    0.004 * notificationCount +
    0.0005 * appointmentCount +
    0.003 * noteCount +
    0.001 * paymentCount +
    0.001 * paymentPlanCount +
    0.0005 * patientProcedureCount;
  return Math.floor(Math.max(0, maxStorageSize - storageSize));
}

module.exports = {
  calcRemainingDoctors,
  calcRemainingPatients,
  calcRemainingStorage,
};
