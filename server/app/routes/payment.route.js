const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

// Patient specific imports
const controller = require("../controller/payment.controller");
const schema = require("../schemas/payment.schema");

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
    .route(`/patients/:patientId/payments`)
    /**
     * Get payment list of the given patientId
     * @param {string} patientId id of the patient
     */
    .get(controller.getPayments);

  router
    .route(`/payments`)
    /**
     * Add a Payment
     * @body Payment information
     */
    .post(validate(schema.payment, "body"), controller.savePayment);

  router
    .route(`/payments/:paymentId`)
    /**
     * Update the Payment
     * @param paymentId: Id of the Payment
     */
    .put(
      validate(schema.id, "params"),
      validate(schema.payment, "body"),
      controller.updatePayment
    )
    /**
     * Delete the Payment
     * @param paymentId: Id of the Payment
     */
    .delete(validate(schema.id, "params"), controller.deletePayment);

  app.use(API_URL, router);
};
