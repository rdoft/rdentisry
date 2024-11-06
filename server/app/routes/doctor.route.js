const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");
const { isSubActive, checkDoctorLimit } = require("../middleware/subscription");

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
  router.use(isAuthenticated);

  router
    .route(``)
    /**
     * Get doctor list
     * Limited to the maxDoctors in the subscription
     */
    .get(controller.getDoctors)
    /**
     * Add a doctor
     * @body Doctor informations
     */
    .post(
      isSubActive,
      checkDoctorLimit,
      validate(schema.doctor, "body"),
      controller.saveDoctor
    );

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
    )
    /**
     * Delete the doctor
     * @param doctorId id of the doctor
     */
    .delete(
      isSubActive,
      validate(schema.id, "params"),
      controller.deleteDoctor
    );

  app.use(API_URL, router);
};
