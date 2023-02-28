const controller = require("../controller/patient.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
      );
      next();
  });

  /**
   * Get patient list
   */
  app.get("/api/patients", controller.getPatients);

  /**
   * Add a patient
   * @body Patient informations
   */
  app.post("/api/patients", controller.addPatient);

  /**
   * Delete the patient
   * @param id: Id of the patient
   */
  app.delete("/api/patients/:id", controller.deletePatient);
};