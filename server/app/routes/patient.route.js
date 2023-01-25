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
};