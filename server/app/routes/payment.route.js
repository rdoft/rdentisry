const router = require("express").Router();
const { validate, validateOR } = require("../middleware/validation");
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
     * @query {boolean} plan whether to get payment plans or actual payments
     */
    .get(controller.getPayments);

  router
    .route(`/payments`)
    /**
     * Update the Payment or Payment Plan
     * @param paymentId: Id of the Payment or Payment Plan
     * @query {boolean} plan whether to update payment plan or actual payment
     */
    .post(
      validateOR(schema.payment, schema.paymentPlan, "body"),
      controller.savePayment
    );

  router
    .route(`/payments/:paymentId`)
    /**
     * Update the Payment
     * @param paymentId: Id of the Payment
     */
    .put(
      validate(schema.id, "params"),
      validateOR(schema.payment, schema.paymentPlan, "body"),
      controller.updatePayment
    )
    /**
     * Delete the Payment or Payment Plan
     * @param paymentId: Id of the Payment or Payment Plan
     * @query {boolean} plan whether to delete payment plan or actual payment
     */
    .delete(validate(schema.id, "params"), controller.deletePayment);

  app.use(API_URL, router);
};
