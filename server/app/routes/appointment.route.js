const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

// Appointment specific imports
const controller = require("../controller/appointment.controller");
const schema = require("../schemas/appointment.schema");

// Constants
const API_URL = "/api/appointments";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
    );
    next();
  });

  // Control user authentication
  // TODO: Add control for routes that need isActive check
  router.use(isAuthenticated);

  router
    .route(``)
    /**
     * Get Appointment list
     */
    .get(controller.getAppointments)
    /**
     * Add a Appointment
     */
    .post(validate(schema.appointment, "body"), controller.saveAppointment);

  router
    .route(`/:appointmentId`)
    /**
     * Get an Appointment
     */
    .get(validate(schema.id, "params"), controller.getAppointment)
    /**
     * Update the Appointment
     * @param appointmentId: Id of the Appointment
     */
    .put(
      validate(schema.id, "params"),
      validate(schema.appointment, "body"),
      controller.updateAppointment
    )
    /**
     * Delete the Appointment
     * @param appointmentId: Id of the Appointment
     */
    .delete(validate(schema.id, "params"), controller.deleteAppointment);

  app.use(API_URL, router);
};
