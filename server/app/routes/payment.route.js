const router = require("express").Router();
const { validate, validateOR } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");
const {
  isSubActive,
  checkStorageLimit,
} = require("../middleware/subscription");

// Patient specific imports
const controller = require("../controller/payment.controller");
const schema = require("../schemas/payment.schema");

// Constants
const API_URL = "/api/payments";

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
     * Get payment list of the given patientId
     * @query {string} patientId id of the patient
     * @query {boolean} plan whether to get payment plans or actual payments
     */
    .get(controller.getPayments)
    /**
     * Add a Payment or Payment Plan
     * @body Payment or Payment Plan information
     * @query {boolean} plan whether to save payment plan or actual payment
     */
    .post(
      isSubActive,
      checkStorageLimit,
      validateOR(schema.payment, schema.paymentPlan, "body"),
      controller.savePayment
    );

  router
    .route(`/:paymentId`)
    /**
     * Update the Payment
     * @param paymentId: Id of the Payment
     * @query {boolean} plan whether to update payment plan or actual payment
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
    .delete(
      isSubActive,
      validate(schema.id, "params"),
      controller.deletePayment
    );

  app.use(API_URL, router);
};
