const router = require("express").Router();
const { validate } = require("../middleware/validation");

// Appointment specific imports
const controller = require("../controller/note.controller");
const schema = require("../schemas/note.schema");

// Constants
const API_URL = "/api/notes";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
    );
    next();
  });

  router
    .route(``)
    /**
     * Get note list of the given patientId
     * @param {string} patientId id of the patient
     */
    .get(controller.getNotes)
    
  app.use(API_URL, router);
};
