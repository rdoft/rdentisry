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
      return res.status(402).send({
        message:
          "Aktif aboneliğiniz bulunmamaktadır. Lütfen aboneliğinizi yenileyin.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send(error);
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
      return res.status(402).send({
        message:
          "Maksimum hasta limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send(error);
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
      return res.status(402).send({
        message:
          "Maksimum doktor limitine ulaştınız. Lütfen aboneliğinizi yükseltin.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send(error);
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

    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  isSubActive,
  checkLimitPatient,
  checkLimitDoctor,
  setLimit,
};
