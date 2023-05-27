const router = require("express").Router();
const { validate } = require("../middleware/validation");

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
     * Delete the Appointment
     * @param appointmentId: Id of the Appointment
     */
    .delete(validate(schema.id, "params"), controller.deleteAppointment);

  app.use(API_URL, router);
};
