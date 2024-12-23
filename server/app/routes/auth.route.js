const router = require("express").Router();
var passport = require("../config/passport.config");
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

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
      validate(schema.login, "body"),
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
    .post(validate(schema.register, "body"), controller.register);

  router
    .route(`/google`)
    /**
     * Google login
     */
    .get((req, res, next) => {
      const scope = ["profile", "email"];
      const state = JSON.stringify({
        referralCode: req.query?.referralCode || null,
      });
      passport.authenticate("google", { scope, state })(req, res, next);
    });

  router
    .route(`/google/callback`)
    /**
     * Google login callback
     */
    .get(passport.authenticate("google"), controller.google);

  router
    .route(`/tokens/:token`)
    /**
     * Control the token for the given type
     * @param token
     * @query type
     */
    .get(controller.controlToken);

  router
    .route(`/forgot`)
    /**
     * Forgot password
     * @body User email
     */
    .post(validate(schema.forgot, "body"), controller.forgot);

  router
    .route(`/reset/:token`)
    /**
     * Reset password
     * @body User password
     */
    .post(validate(schema.reset, "body"), controller.reset);

  router
    .route(`/verify`)
    /**
     * Init verify for email
     */
    .post(controller.initVerify);

  router
    .route(`/verify/:token`)
    /**
     * Complete the email verification
     */
    .post(controller.completeVerify);

  router
    .route(`/permission`)
    /**
     * Check permission
     */
    .get(controller.permission);

  router
    .route(`/agree`)
    /**
     * Agree to terms
     * @body User agreement
     */
    .put(isAuthenticated, controller.agree);

  app.use(API_URL, router);
};
