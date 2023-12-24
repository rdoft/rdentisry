const router = require("express").Router();

// Procedure specific imports
const controller = require("../controller/procedure.controller");

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
    .post(controller.saveProcedure);

  router
    .route(`/procedures/:procedureId`)
    /**
     * Get the procedure with given id
     * @param procedureId id of the procedure
     */
    .get(controller.getProcedure)
    /**
     * Update the procedure
     * @param procedureId: Id of the Procedure
     * @body Procedure informations
     */
    .put(controller.updateProcedure)
    /**
     * Delete the procedure
     * @param procedureId: Id of the procedure
     */
    .delete(controller.deleteProcedure);

  app.use(API_URL, router);
};
