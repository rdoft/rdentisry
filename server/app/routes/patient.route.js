const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");
const {
  isSubActive,
  checkPatientLimit,
} = require("../middleware/subscription");

// Patient specific imports
const controller = require("../controller/patient.controller");
const schema = require("../schemas/patient.schema");

// Constants
const API_URL = "/api/patients";

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
     * Get patient list
     */
    .get(controller.getPatients)
    /**
     * Add a patient
     * @body Patient informations
     */
    .post(
      isSubActive,
      checkPatientLimit,
      validate(schema.patient, "body"),
      controller.savePatient
    )
    /**
     * Delete patients of the given Ids
     * @query patientId: Id list of patients
     */
    .delete(
      isSubActive,
      validate(schema.ids, "query"),
      controller.deletePatients
    )
    /**
     * Update patients of the given Ids
     * @query patientId: Id list of patients
     * @body Patient informations
     */
    .put(validate(schema.ids, "query"), controller.updatePatientsPermission);

  router
    .route(`/:patientId`)
    /**
     * Get the patient with given id
     * @param patientId id of the patient
     */
    .get(validate(schema.id, "params"), controller.getPatient)
    /**
     * Update the patient
     * @param patientId id of the patient
     * @body Patient informations
     */
    .put(
      validate(schema.id, "params"),
      validate(schema.patient, "body"),
      controller.updatePatient
    )
    /**
     * Delete the patient
     * @param patientId: Id of the patient
     */
    .delete(
      isSubActive,
      validate(schema.id, "params"),
      controller.deletePatient
    );

  app.use(API_URL, router);
};
