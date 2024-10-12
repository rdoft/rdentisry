const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");
const { isSubActive } = require("../middleware/subscription");

// Visit specific imports
const controller = require("../controller/visit.controller");
const schema = require("../schemas/visit.schema");

// Constants
const API_URL = "/api/visits";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Control user authentication
  router.use(isAuthenticated);

  router
    .route(``)
    /**
     * Get visits for a given patientId
     * @query patientId id of the patient
     * @query approved if the visit is approved
     */
    .get(controller.getVisits)
    /**
     * Add a new visit
     * @query patientId id of the patient
     * @body patientProcedures list of patient procedures
     */
    .post(isSubActive, controller.saveVisit);

  router
    .route(`/:visitId`)
    /**
     * Update the visit
     * @param visitId id of the visit
     * @body Visit informations
     */
    .put(
      validate(schema.id, "params"),
      validate(schema.visit, "body"),
      controller.updateVisit
    )
    /**
     * Delete the visit
     * @param visitId id of the visit
     */
    .delete(validate(schema.id, "params"), controller.deleteVisit);

  app.use(API_URL, router);
};
