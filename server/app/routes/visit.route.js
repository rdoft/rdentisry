const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

// Visit specific imports
const controller = require("../controller/visit.controller");
const schema = require("../schemas/visit.schema");

// Constants
const API_URL = "/api";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.use(isAuthenticated);

  router
    .route(`/patients/:patientId/visits`)
    /**
     * Get visits for a given patientId
     * @param patientId id of the patient
     */
    .get(controller.getVisits)
    /**
     * Add a new visit
     * @body Visit informations along with patientProcedures
     */
    .post(controller.saveVisit);

  router
    .route(`/patients/:patientId/visits/:visitId`)
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
