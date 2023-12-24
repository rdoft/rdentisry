const router = require("express").Router();
var passport = require("../config/passport.config");
const { validate } = require("../middleware/validation");


// Auth specific imports
const controller = require("../controller/auth.controller");
const schema = require("../schemas/user.schema");

const API_URL = "/auth";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
    );
    next();
  });

  router
    .route(`/login`)
    /**
     * Login
     * @body User informations
     */
    .post(
      // validate(schema.login, "body"),
      passport.authenticate("local"),
      controller.login
    );

  router
    .route(`/logout`)
    /**
     * Logout
     */
    .post(controller.logout);

  router
    .route(`/register`)
    /**
     * Register
     * @body User informations
     */
    .post(validate(schema.user, "body"), controller.register);

  app.use(API_URL, router);
};
