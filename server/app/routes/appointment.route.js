const router = require("express").Router();
const { validate } = require("../middleware/validation");

// Appointment specific imports
const controller = require("../controller/appointment.controller");

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
     * Get appointment list
     */
    .get(controller.getAppointment)
     /**
     * Add a Appointment
     * @body Appointment informations
     */
     .post(validate(schema.appointment, "body"), controller.AddAppointment)
     
  app.use(API_URL, router);
};
