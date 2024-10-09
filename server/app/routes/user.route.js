const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

// User specific imports
const controller = require("../controller/user.controller");
const schema = require("../schemas/user.schema");

// Constants
const API_URL = "/api/user";

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
     * Get the user
     * @param userId id of the user
     */
    .get(controller.getUser)
    /**
     * Update the user
     * @body name and password
     */
    .put(validate(schema.user, "body"), controller.updateUser);

  router
    .route(`/settings`)
    /**
     * Get the user settings
     */
    .get(controller.getSettings)
    /**
     * Update the user settings
     * @body settings - The user's settings like apointmentReminder
     */
    .put(controller.updateSettings);

  app.use(API_URL, router);
};
