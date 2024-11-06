const log = require("../config/log.config");
const { Sequelize } = require("../models");
const db = require("../models");
const Subscription = db.subscription;

// Check if subscription is active
// There is 4 state: active, passive, pending, cancelled
const isSubActive = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send({
        message: "Yetkilendirme hatası. Lütfen tekrar giriş yapın.",
      });
      log.access.warn("Is subscription active failed: Unauthorized access", {
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
      where: {
        UserId: userId,
        Status: "active",
      },
    });

    // Send error if subscription is not active
    if (!subscription) {
      res.status(402).send({
        message:
          "Aktif aboneliğiniz bulunmamaktadır. Lütfen abonelik satın alın.",
      });
      log.access.warn("Is subscription active failed: Subscription not found", {
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
const checkPatientLimit = async (req, res, next) => {
  try {
    const userId = req.user.UserId;
    const subscription = req.subscription;

    // Send error if exceeds patient limit
    if (subscription.Patients <= 0) {
      res.status(402).send({
        message:
          "Maksimum hasta limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
      log.access.warn("Check patient limit: Patient limit exceeded.", {
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
const checkDoctorLimit = async (req, res, next) => {
  try {
    const userId = req.user.UserId;
    const subscription = req.subscription;

    // Send error if exceeds doctor limit
    if (subscription.Doctors <= 0) {
      res.status(402).send({
        message:
          "Maksimum doktor limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
      log.access.warn("Check doctor limit failed: Doctor limit exceeded.", {
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

// Check if user exceeds storage limit
const checkStorageLimit = async (req, res, next) => {
  try {
    const userId = req.user.UserId;
    const subscription = req.subscription;

    // Send error if exceeds storage limit
    if (subscription.Storage <= 0) {
      res.status(402).send({
        message:
          "Maksimum depolama limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
      log.access.warn("Check storage limit failed: Storage limit exceeded.", {
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

// Check if user exceeds SMS limit
const checkSMSLimit = async (req, res, next) => {
  try {
    const userId = req.user.UserId;
    const subscription = req.subscription;

    // Send error if exceeds SMS limit
    if (subscription.SMS <= 0) {
      res.status(402).send({
        message: "SMS limitiniz dolmuştur. Lütfen aboneliğinizi yükseltin.",
      });
      log.access.warn("Check SMS limit failed: SMS limit exceeded.", {
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
// TODO: Apply this to necessary routes
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

    const subscription = await Subscription.findOne({
      where: {
        UserId: req.user.UserId,
        Status: "active",
      },
      include: [
        {
          model: Pricing,
          as: "pricing",
        },
        {
          model: Bonus,
          as: "bonus",
          where: {
            EndDate: {
              [Sequelize.Op.gte]: new Date(),
            },
          },
        },
      ],
    });

    if (!subscription) {
      req.limit = {
        maxDoctors: 1,
        maxPatients: 75,
      };
    } else {
      req.limit = {
        maxDoctors:
          (subscription.pricing?.DoctorCount ?? 1) +
          (pricing?.bonus?.DoctorCount ?? 0),
        maxPatients:
          (subscription.pricing.PatientCount ?? 75) +
          (pricing?.bonus?.PatientCount ?? 0),
      };
    }

    next();
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
    return;
  }
};

module.exports = {
  isSubActive,
  checkPatientLimit,
  checkDoctorLimit,
  checkStorageLimit,
  checkSMSLimit,
  setLimit,
};
