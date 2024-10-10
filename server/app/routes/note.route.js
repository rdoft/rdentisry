const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");
const { isSubActive } = require("../middleware/subscription");

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

  // Control user authentication
  router.use(isAuthenticated);

  router
    .route(``)
    /**
     * Get note list of the given patientId
     * @query {string} patientId id of the patient
     */
    .get(controller.getNotes)
    /**
     * Add a note
     */
    .post(isSubActive, validate(schema.note, "body"), controller.saveNote);

  router
    .route(`/:noteId`)
    /**
     * Get an Note
     * @param noteId: Id of the Note
     */
    .get(validate(schema.id, "params"), controller.getNote)
    /**
     * Update the Note
     * @param noteId: Id of the Note
     */
    .put(
      validate(schema.id, "params"),
      validate(schema.note, "body"),
      controller.updateNote
    )
    /**
     * Delete the Note
     * @param noteId: Id of the Note
     */
    .delete(validate(schema.id, "params"), controller.deleteNote);

  app.use(API_URL, router);
};
