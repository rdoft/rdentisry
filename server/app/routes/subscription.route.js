const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

const controller = require("../controller/subscription.controller");
const schema = require("../schemas/subscription.schema");

const API_URL = "/api/subscriptions";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-TypeError, Accept"
    );
    next();
  });

  router
    .route(`/checkout`)
    /**
     * Init checkout proccess by creating billing & subscription with pending status
     * @body pricingId and billing information
     * @return id of the subscription and checkout form
     */
    .post(
      isAuthenticated,
      validate(schema.billing, "body"),
      controller.checkout
    );

  router
    .route(`/callback`)
    /**
     * Callback function of checkout proccess for the payment
     * Get the checkout status and update the subscription and billing status accordingly
     * @body token
     * @return empty response
     */
    .post(validate(schema.token, "body"), controller.callback);

  router
    .route(`/checkout/:subscriptionId`)
    /**
     * Control the payment status of given subscription
     * @param subscriptionId
     * @return status of the subscription
     */
    .get(isAuthenticated, validate(schema.id, "params"), controller.getStatus);

  router
    .route(`/subscription`)
    /**
     * Get active subscription of the user
     * @user
     * @return active subscription
     */
    .get(isAuthenticated, controller.getSubscription)
    /**
     * Update the pricing plan of the subscription of the user
     * @body pricingId of the new pricing plan
     * @user
     * @return empty response
     */
    .put(
      isAuthenticated,
      validate(schema.pricingId, "body"),
      controller.updateSubscription
    );

  router
    .route(`/subscription/cancel`)
    /**
     * Cancel the subscription of the user
     * @user
     * @return empty response
     */
    .post(isAuthenticated, controller.cancelSubscription);

  /**
   * Get pricing plans
   * @return pricings
   */
  router.route(`/pricings`).get(controller.getPricings);

  app.use(API_URL, router);
};