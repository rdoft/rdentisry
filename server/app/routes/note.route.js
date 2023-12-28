const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

// Appointment specific imports
const controller = require("../controller/note.controller");
const schema = require("../schemas/note.schema");

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

  // Control user authentication
  // TODO: Add control for routes that need isActive check
  router.use(isAuthenticated);

  router
    .route(`/patients/:patientId/notes`)
    /**
     * Get note list of the given patientId
     * @param {string} patientId id of the patient
     */
    .get(controller.getNotes)

    /**
     * Delete all notes of given patient
     * @param patientId: Id of the patient
     */
    .delete(controller.deleteNotes);

  router
    .route(`/notes`)
    /**
     * Add a note
     */
    .post(validate(schema.note, "body"), controller.saveNote);

  router
    .route(`/notes/:noteId`)
    /**
     * Get an Note
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
