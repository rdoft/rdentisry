const router = require("express").Router();
const { validate } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/auth");

// Invoice specific imports
const controller = require("../controller/invoice.controller");
const schema = require("../schemas/invoice.schema");

// Constants
const API_URL = "/api";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.use(isAuthenticated);

  router
    .route(`/patients/:patientId/invoices`)
    /**
     * Add a new invoice
     * @body Invoice informations along with patientProcedures
     */
    .post(controller.saveInvoice);

  router
    .route(`/patients/:patientId/invoices/:invoiceId`)
    /**
     * Update the invoice
     * @param invoiceId id of the invoice
     * @body Invoice informations
     */
    .put(
      validate(schema.id, "params"),
      validate(schema.invoice, "body"),
      controller.updateInvoice
    )
    /**
     * Delete the invoice
     * @param invoiceId id of the invoice
     */
    .delete(validate(schema.id, "params"), controller.deleteInvoice);

  app.use(API_URL, router);
};
