const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");
const { isSubActive, checkSMSLimit } = require("../middleware/subscription");

// Reminder specific imports
const controller = require("../controller/reminder.controller");
const schema = require("../schemas/reminder.schema");

// Constants
const API_URL = "/api/reminders";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
    );
    next();
  });

  router
    .route(`/appointments`)
    /**
     * Add a Reminder to an Appointment
     * @query appointmentId: Id of the Appointment
     */
    .post(
      isAuthenticated,
      isSubActive,
      checkSMSLimit,
      validate(schema.appointmentId, "query"),
      controller.remindAppointment
    );

  router
    .route(`/appointments/:token`)
    /**
     * Update a reminder field of an Appointment
     * @params token
     * @body Reminder field of the Appointment
     */
    .put(controller.action);

  router
    .route(`/payments`)
    /**
     * Add a Reminder to a Payment
     * @query patientId: Id of the Patient
     */
    .post(
      isAuthenticated,
      isSubActive,
      checkSMSLimit,
      validate(schema.pateintId, "query"),
      controller.remindPayment
    );

  app.use(API_URL, router);
};
