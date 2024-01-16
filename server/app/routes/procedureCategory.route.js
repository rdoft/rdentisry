const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");

// Patient specific imports
const controller = require("../controller/procedureCategory.controller");

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
    .route(`/procedure-categories`)
    /**
     * Get procedure categories
     */
    .get(controller.getProcedureCategories)
    /**
     * Add a category
     * @body category information
     */
    .post(controller.saveProcedureCategory);

  router
    .route(`/procedure-categories/:procedureCategoryId`)
    /**
     * Delete the category
     * @param procedureCategoryId: Id of the category
     */
    .delete(controller.deleteProcedureCategory);

  app.use(API_URL, router);
};
