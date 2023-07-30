const router = require("express").Router();

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
