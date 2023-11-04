const router = require("express").Router();

// PatientProcedure specific imports
const controller = require("../controller/patientProcedure.controller");

// Constants
const API_URL = "/api";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
    );
    next();
  });

  router
    .route(`/patients/:patientId/procedures`)
    /**
     * Get the procedures of the selected patient
     * @param patientId id of the patient
     * @query tooth: number of the tooth
     * @query completed: flag for completed/noncompleted
     */
    .get(controller.getPatientProcedures)
    /**
     * Add a procedure to the patient
     * @body PatientProcedure informations
     */
    .post(controller.savePatientProcedure);

  router
    .route(`/patients/:patientId/procedures/:patientProcedureId`)
    /**
     * Delete the procedure
     * @param patientId id of the patient
     * @param patientProcedureId: id of the patientProcedure
     */
    .delete(controller.deletePatientProcedure)
    /**
     * Update a procedure of the patient
     * @param patientId id of the patient
     * @param patientProcedureId id of the patientprocedure
     * @body tooth and procedure informations
     */
    .put(controller.updatePatientProcedure);

  app.use(API_URL, router);
};
