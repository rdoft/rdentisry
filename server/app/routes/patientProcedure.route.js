const router = require("express").Router();
const { validate } = require("../middleware/validation");

// PatientProcedure specific imports
const controller = require("../controller/patientProcedure.controller");

// Constants
const API_URL = "/api";

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
  .delete(controller.deletePatientProcedure);
