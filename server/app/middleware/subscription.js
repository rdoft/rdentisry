const log = require("../config/log.config");
const db = require("../models");
const Subscription = db.subscription;
const Patient = db.patient;
const Doctor = db.doctor;

// Check if subscription is valid
// There is 3 state: free, active, inactive
const isSubActive = async (req, res, next) => {
  try {
    const userId = req.user.UserId;
    const subscription = await Subscription.findOne({
      where: { UserId: userId },
    });

    // Send error if subscription inactive
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
          ip: req.ip,
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
    if (patientCount >= subscription.MaxPatients) {
      res.status(402).send({
        message:
          "Maksimum hasta limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
      log.access.warn("Payment required: Max patient limit", {
        userId: userId,
        action: "ACCESS",
        success: false,
        request: {
          ip: req.ip,
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
    if (doctorCount >= subscription.MaxDoctors) {
      res.status(402).send({
        message:
          "Maksimum doktor limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
      log.access.warn("Payment required: Max doctor limit", {
        userId: userId,
        action: "ACCESS",
        success: false,
        request: {
          ip: req.ip,
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
    const userId = req.user.UserId;
    const subscription = await Subscription.findOne({
      where: { UserId: userId },
    });

    req.limit = {
      maxPatients: subscription.MaxPatients,
      maxDoctors: subscription.MaxDoctors,
    };

    log.access.info("Payment required: Set limit", {
      userId: userId,
      action: "ACCESS",
      success: true,
      request: {
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        status: 200,
        agent: req.headers["user-agent"],
      },
    });

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
