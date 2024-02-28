const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

// Procedure specific imports
const controller = require("../controller/procedure.controller");
const schema = require("../schemas/procedure.schema");

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
    .route(`/procedures`)
    /**
     * Get Procedure list
     */
    .get(controller.getProcedures)
    /**
     * Add a Procedure
     * @body Procedure information
     */
    .post(validate(schema.procedure, "body"), controller.saveProcedure)
    /**
     * Delete procedures of the given Ids
     * If ids not given then delete all procedures
     * @query ids: Id list of procedures
     */
    .delete(validate(schema.ids, "query"), controller.deleteProcedures);

  router
    .route(`/procedures/:procedureId`)
    /**
     * Get the procedure with given id
     * @param procedureId id of the procedure
     */
    .get(validate(schema.id, "params"), controller.getProcedure)
    /**
     * Update the procedure
     * @param procedureId: Id of the Procedure
     * @body Procedure informations
     */
    .put(
      validate(schema.id, "params"),
      validate(schema.procedure, "body"),
      controller.updateProcedure
    )
    /**
     * Delete the procedure
     * @param procedureId: Id of the procedure
     */
    .delete(validate(schema.id, "params"), controller.deleteProcedure);

  app.use(API_URL, router);
};
