const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const Note = db.note;
const Doctor = db.doctor;
const Patient = db.patient;
const Pricing = db.pricing;
const Appointment = db.appointment;
const Subscription = db.subscription;

// Constant for the storage size in MB
const APPOINTMENT_SIZE = 0.0628;
const NOTE_SIZE = 0.0628;

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

  const storageSize = Math.floor(
    APPOINTMENT_SIZE * appointmentCount + NOTE_SIZE * noteCount
  );
  return Math.max(0, maxStorageSize - storageSize);
}

/**
 * Calculate the remaining SMS for the subscription
 * @param {number} userId - The user's id
 * @param {number} maxSMSCount - The maximum SMS count based on pricing
 * @return {number} - The remaining SMS count
 */
async function calcRemainingSMS(userId, maxSMSCount) {
  // TODO: Implement this function

  return Math.max(0, maxSMSCount);
}

/**
 * Calculate the remainings for all subscription limits
 * @param {number} userId - The user's id
 * @param {object} pricing - The pricing object
 * @return {object} - The remaining limits
 */
async function calcRemainingLimits(userId, pricing) {
  const [remainDoctors, remainPatients, remainStorage, remainingSMS] =
    await Promise.all([
      calcRemainingDoctors(userId, pricing.DoctorCount),
      calcRemainingPatients(userId, pricing.PatientCount),
      calcRemainingStorage(userId, pricing.StorageSize),
      calcRemainingSMS(userId, pricing.SMSCount),
    ]);

  return {
    remainDoctors: remainDoctors ?? 0,
    remainPatients: remainPatients ?? 0,
    remainStorage: remainStorage ?? 0,
    remainingSMS: remainingSMS ?? 0,
  };
}

/**
 * Set the doctors limit for the subscription
 * @param {number} userId - The user's id
 * @param {number} by - The value to increment or decrement
 * @param {object} transaction - The transaction object
 */
async function setDoctorLimit(userId, by, transaction) {
  // Get the subscription
  const subscription = await Subscription.findOne({
    where: {
      UserId: userId,
      Status: "active",
    },
    transaction,
  });
  // Check if the subscription exists
  if (!subscription) {
    log.app.error(`Set doctor limit failed: Subscription not found`, {
      success: false,
      userId: userId,
    });
    const error = new Error("Aktif aboneliğiniz bulunmamaktadır");
    error.code = 402;
    throw error;
  }
  // Check if the limit is exceeded
  if (subscription.Doctors + by < 0) {
    log.app.error(`Set doctor limit failed: Limit exceeded`, {
      success: false,
      userId: userId,
      resource: {
        type: "subscription",
        by: by,
      },
    });
    const error = new Error("Yetersiz limit, lütfen aboneliğinizi yükseltin");
    error.code = 402;
    throw error;
  }

  // Update the limit
  await subscription.update(
    { Doctors: subscription.Doctors + by },
    { transaction }
  );
}

/**
 * Set patients limit for the subscription
 * @param {number} userId - The user's id
 * @param {number} by - The value to increment or decrement
 * @param {object} transaction - The transaction object
 */
async function setPatientLimit(userId, by, transaction) {
  // Get the subscription
  const subscription = await Subscription.findOne({
    where: {
      UserId: userId,
      Status: "active",
    },
    transaction,
  });
  // Check if the subscription exists
  if (!subscription) {
    log.app.error(`Set patient limit failed: Subscription not found`, {
      success: false,
      userId: userId,
    });
    const error = new Error("Aktif aboneliğiniz bulunmamaktadır");
    error.code = 402;
    throw error;
  }
  // Check if the limit is exceeded
  if (subscription.Patients + by < 0) {
    log.app.error(`Set patient limit failed: Limit exceeded`, {
      success: false,
      userId: userId,
      resource: {
        type: "subscription",
        by: by,
      },
    });
    const error = new Error("Yetersiz limit, lütfen aboneliğinizi yükseltin");
    error.code = 402;
    throw error;
  }

  // Update the limit
  await subscription.update(
    { Patients: subscription.Patients + by },
    { transaction }
  );
}

/**
 * Set the storage limit for the subscription
 * @param {number} userId - The user's id
 * @param {object} transaction - The transaction object
 */
async function setStorageLimit(userId, transaction) {
  // Get the subscription
  const subscription = await Subscription.findOne({
    where: {
      UserId: userId,
      Status: "active",
    },
    include: [
      {
        model: Pricing,
        as: "pricing",
        attributes: ["StorageSize"],
      },
    ],
    transaction,
  });
  // Check if the subscription exists
  if (!subscription) {
    log.app.error(`Set storage limit failed: Subscription not found`, {
      success: false,
      userId: userId,
    });
    const error = new Error("Aktif aboneliğiniz bulunmamaktadır");
    error.code = 402;
    throw error;
  }
  // Get the resources
  const appointmentCount = await Appointment.count({
    include: [
      {
        model: Patient,
        as: "patient",
        where: { UserId: userId },
      },
    ],
    transaction,
  });
  const noteCount = await Note.count({
    include: [
      {
        model: Patient,
        as: "patient",
        where: { UserId: userId },
      },
    ],
    transaction,
  });
  // Calculate the storage size
  const maxStorageSize = subscription.pricing.StorageSize;
  const storageSize = Math.floor(
    APPOINTMENT_SIZE * appointmentCount + NOTE_SIZE * noteCount
  );

  // Check if the limit is exceeded
  if (maxStorageSize - storageSize < 0) {
    log.app.error(`Set storage limit failed: Limit exceeded`, {
      success: false,
      userId: userId,
      resource: {
        type: "subscription",
        size: storageSize,
      },
    });
    const error = new Error("Yetersiz limit, lütfen aboneliğinizi yükseltin");
    error.code = 402;
    throw error;
  }

  // Update the limit
  await subscription.update(
    { Storage: maxStorageSize - storageSize },
    { transaction }
  );
}

module.exports = {
  calcRemainingDoctors,
  calcRemainingPatients,
  calcRemainingStorage,
  calcRemainingSMS,
  calcRemainingLimits,
  setDoctorLimit,
  setPatientLimit,
  setStorageLimit,
};