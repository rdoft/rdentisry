const router  = require('express').Router();
const API_URL = "/api/patients";
const controller = require("../controller/patient.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
      );
      next();
  });

  router.route(``)
    .get(controller.getPatients)  // Get patients
    .post(controller.savePatient) // Save patient
    .delete(controller.deletePatients) // Delete patients
  router.route(`/:patientId`)
    // .get(controller.getPatient)  // Get a patient
    // .put(controller.updatePatient)  // Update a patient
    .delete(controller.deletePatient) // Delete a patient

  app.use(API_URL, router);
};