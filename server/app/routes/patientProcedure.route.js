const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const {
  isSubActive,
  checkStorageLimit,
} = require("../middleware/subscription");

// PatientProcedure specific imports
const controller = require("../controller/patientProcedure.controller");

// Constants
const API_URL = "/api/patient-procedures";

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
     * Get the procedures of the selected patient
     * @query patientId id of the patient
     * @query tooth: number of the tooth
     * @query completed: flag for completed/noncompleted
     */
    .get(controller.getPatientProcedures)
    /**
     * Add a procedure to the patient
     * @query patientId id of the patient
     * @body PatientProcedure informations
     */
    .post(isSubActive, checkStorageLimit, controller.savePatientProcedure);

  router
    .route(`/:patientProcedureId`)
    /**
     * Delete the procedure
     * @param patientProcedureId: id of the patientProcedure
     */
    .delete(isSubActive, controller.deletePatientProcedure)
    /**
     * Update a procedure of the patient
     * @param patientProcedureId id of the patientprocedure
     * @query patientId id of the patient
     * @body tooth and procedure informations
     */
    .put(controller.updatePatientProcedure);

  app.use(API_URL, router);
};
