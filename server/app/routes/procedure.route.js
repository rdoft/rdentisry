const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");
const {
  isSubActive,
  checkStorageLimit,
} = require("../middleware/subscription");

// Procedure specific imports
const controller = require("../controller/procedure.controller");
const schema = require("../schemas/procedure.schema");

// Constants
const API_URL = "/api/procedures";

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
     * Get Procedure list
     * @query categoryId: Category Id
     */
    .get(controller.getProcedures)
    /**
     * Add a Procedure
     * @body Procedure information
     */
    .post(
      isSubActive,
      checkStorageLimit,
      validate(schema.procedure, "body"),
      controller.saveProcedure
    )
    /**
     * Delete procedures of the given Ids
     * @query ids: Id list of procedures
     */
    .delete(
      isSubActive,
      validate(schema.ids, "query"),
      controller.deleteProcedures
    );

  router
    .route(`/:procedureId`)
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
    .delete(
      isSubActive,
      validate(schema.id, "params"),
      controller.deleteProcedure
    );

  app.use(API_URL, router);
};
