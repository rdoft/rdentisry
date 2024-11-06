const log = require("../config/log.config");
const db = require("../models");
const Subscription = db.subscription;
const Patient = db.patient;
const Doctor = db.doctor;

// TODO: Update all this functions based on the subscription and pricing controls

// Check if subscription is valid
// There is 4 state: active, passive, pending, cancelled
const isSubActive = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send({
        message: "Yetkilendirme hatası. Lütfen tekrar giriş yapın.",
      });
      log.access.warn("Payment required: Unauthorized access", {
        action: "ACCESS",
        success: false,
        request: {
          ip: req.headers["x-forwarded-for"],
          url: req.originalUrl,
          method: req.method,
          status: 401,
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    const userId = req.user.UserId;
    const subscription = await Subscription.findOne({
      where: { UserId: userId },
    });

    // Send error if subscription is not active
    if (subscription.EndDate && new Date(subscription.EndDate) < new Date()) {
      res.status(402).send({
        message:
          "Aktif aboneliğiniz bulunmamaktadır. Lütfen aboneliğinizi yenileyin.",
      });
      log.access.warn("Payment required: Inactive subscription", {
        userId: userId,
        action: "ACCESS",
        success: false,
        request: {
          ip: req.headers["x-forwarded-for"],
          url: req.originalUrl,
          method: req.method,
          status: 402,
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
    return;
  }
};

// Check if user exceeds patient limit
const checkLimitPatient = async (req, res, next) => {
  try {
    const userId = req.user.UserId;
    const subscription = await Subscription.findOne({
      where: { UserId: userId },
    });
    const patientCount = await Patient.count({
      where: { UserId: userId },
    });

    // Send error if exceeds patient limit
    if (patientCount >= subscription.Patients) {
      res.status(402).send({
        message:
          "Maksimum hasta limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
      log.access.warn("Payment required: Max patient limit", {
        userId: userId,
        action: "ACCESS",
        success: false,
        request: {
          ip: req.headers["x-forwarded-for"],
          url: req.originalUrl,
          method: req.method,
          status: 402,
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
    return;
  }
};

// Check if user exceeds doctor limit
const checkLimitDoctor = async (req, res, next) => {
  try {
    const userId = req.user.UserId;
    const subscription = await Subscription.findOne({
      where: { UserId: userId },
    });
    const doctorCount = await Doctor.count({
      where: { UserId: userId },
    });

    // Send error if exceeds doctor limit
    if (doctorCount >= subscription.Doctors) {
      res.status(402).send({
        message:
          "Maksimum doktor limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
      log.access.warn("Payment required: Max doctor limit", {
        userId: userId,
        action: "ACCESS",
        success: false,
        request: {
          ip: req.headers["x-forwarded-for"],
          url: req.originalUrl,
          method: req.method,
          status: 402,
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
    return;
  }
};

// Set a limit for the number of patients and doctors that can be list
const setLimit = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send({
        message: "Yetkilendirme hatası. Lütfen tekrar giriş yapın.",
      });
      log.access.warn("Payment required: Unauthorized access", {
        action: "ACCESS",
        success: false,
        request: {
          ip: req.headers["x-forwarded-for"],
          url: req.originalUrl,
          method: req.method,
          status: 401,
          agent: req.headers["user-agent"],
        },
      });
      return;
    }

    const userId = req.user.UserId;
    const subscription = await Subscription.findOne({
      where: { UserId: userId },
    });

    req.limit = {
      maxPatients: subscription.Patients,
      maxDoctors: subscription.Doctors,
    };

    next();
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
    return;
  }
};

module.exports = {
  isSubActive,
  checkLimitPatient,
  checkLimitDoctor,
  setLimit,
};
