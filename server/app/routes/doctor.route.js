const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

// Patient specific imports
const controller = require("../controller/doctor.controller");
const schema = require("../schemas/doctor.schema");

// Constants
const API_URL = "/api/doctors";

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
     * Get doctor list
     */
    .get(controller.getDoctors)
    /**
     * Add a doctor
     * @body Doctor informations
     */
    .post(validate(schema.doctor, "body"), controller.saveDoctor);

  router
    .route(`/:doctorId`)
    // .get(controller.getDoctor)
    /**
     * Update the doctor
     * @param doctorId id of the doctor
     * @body Doctor informations
     */
    .put(
      validate(schema.id, "params"),
      validate(schema.doctor, "body"),
      controller.updateDoctor
    );

  app.use(API_URL, router);
};
