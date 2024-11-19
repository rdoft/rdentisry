const log = require("../config/log.config");
const { Sequelize, sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const Note = db.note;
const Doctor = db.doctor;
const Patient = db.patient;
const Pricing = db.pricing;
const Bonus = db.bonus;
const Referral = db.referral;
const Appointment = db.appointment;
const Subscription = db.subscription;
const Notification = db.notification;
const NotificationEvent = db.notificationEvent;

// Constant for the storage size in MB
const APPOINTMENT_SIZE = 0.0628;
const NOTE_SIZE = 0.0628;
// Referral bonus and limit
const REFERRAL_LIMIT = 5;
const REFERRER_SMS = 200;
const REFERRER_PATIENT = 100;
const REFERRED_SMS = 100;
const REFERRED_PATIENT = 200;

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

/**
 * Set the SMS limit for the subscription
 * @param {number} userId - The user's id
 * @param {number} by - The value to increment or decrement
 * @param {object} transaction - The transaction object
 */
async function setSMSLimit(userId, by, transaction) {
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
    log.app.error(`Set SMS limit failed: Subscription not found`, {
      success: false,
      userId: userId,
    });
    const error = new Error("Aktif aboneliğiniz bulunmamaktadır");
    error.code = 402;
    throw error;
  }
  // Check if the limit is exceeded
  if (subscription.SMS + by < 0) {
    log.app.error(`Set SMS limit failed: Limit exceeded`, {
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
  await subscription.update({ SMS: subscription.SMS + by }, { transaction });
}

/**
 * Calculate the remainings of subscription limits based on given pricing (and existing bonus)
 * @param {number} userId - The user's id
 * @param {object} pricing - The pricing object
 * @return {object} - The remaining limits
 */
async function calcLimits(userId, pricing) {
  const bonus = (await Bonus.findOne({
    where: {
      UserId: userId,
      EndDate: {
        [Sequelize.Op.or]: {
          [Sequelize.Op.gt]: new Date(),
          [Sequelize.Op.eq]: null,
        },
      },
    },
  })) ?? { DoctorCount: 0, PatientCount: 0, StorageSize: 0, SMSCount: 0 };

  // Calculate the remainings if the subscription not exists
  const [remainDoctors, remainPatients, remainStorage, remainSMS] =
    await Promise.all([
      calcRemainingDoctors(userId, pricing.DoctorCount + bonus.DoctorCount),
      calcRemainingPatients(userId, pricing.PatientCount + bonus.PatientCount),
      calcRemainingStorage(userId, pricing.StorageSize + bonus.StorageSize),
      calcRemainingSMS(pricing.SMSCount + bonus.SMSCount),
    ]);

  return {
    remainDoctors: remainDoctors ?? 0,
    remainPatients: remainPatients ?? 0,
    remainStorage: remainStorage ?? 0,
    remainSMS: remainSMS ?? 0,
  };
}

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
 * @param {number} maxSMSCount - The maximum SMS count based on pricing
 * @return {number} - The remaining SMS count
 */
async function calcRemainingSMS(maxSMSCount) {
  return Math.max(0, maxSMSCount);
}

/**
 * Add the bonus for referral to the user
 * @param {number} referredId - The user's id who is referred
 */
async function referralBonus(referredId) {
  await sequelize.transaction(async (t) => {
    // Get the referral
    const referral = await Referral.findOne({
      where: {
        ReferredId: referredId,
        Status: "pending",
      },
      transaction: t,
    });
    // Check if the referral exists
    if (!referral) {
      log.app.warn(`Referral bonus failed: Referral not found`, {
        success: false,
        referredId: referredId,
      });
      return;
    }

    // Update the referral
    await referral.update({ Status: "success" }, { transaction: t });

    // Add bonus to the referred
    await Bonus.create(
      {
        UserId: referral.ReferredId,
        SMSCount: REFERRED_SMS,
        PatientCount: REFERRED_PATIENT,
        EndDate: new Date(new Date().setHours(new Date().getHours() + 1)),
      },
      { transaction: t }
    );

    // Add bonus to the referrer if the referral limit is not exceeded
    const count = await Referral.count({
      where: {
        ReffererId: referral.ReffererId,
        Status: "success",
      },
      transaction: t,
    });
    if (count < REFERRAL_LIMIT) {
      await Bonus.create(
        {
          UserId: referral.ReffererId,
          SMSCount: REFERRER_SMS,
          PatientCount: REFERRER_PATIENT,
          EndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
        { transaction: t }
      );

      // Send notification to the referrer
      const [bonusEvent] = await NotificationEvent.findOrCreate({
        where: {
          Event: "bonus",
          Type: "referral",
        },
        transaction: t,
      });
      await Notification.create(
        {
          Message: `Tebrikler, bir kişi sizin referans kodunuzu kullanarak uygulamamıza üye oldu. Kazandığınız hasta ve SMS hakları bir sonraki ay hesabınıza eklenecektir.`,
          Status: "sent",
          UserId: referral.ReffererId,
          NotificationEventId: bonusEvent.NotificationEventId,
        },
        { transaction: t }
      );
    }
  });
}

module.exports = {
  setDoctorLimit,
  setPatientLimit,
  setStorageLimit,
  setSMSLimit,
  calcLimits,
  calcRemainingDoctors,
  calcRemainingPatients,
  calcRemainingStorage,
  calcRemainingSMS,
  referralBonus,
};
