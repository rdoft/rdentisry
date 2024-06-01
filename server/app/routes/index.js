module.exports = (app) => {
  auth = require("./auth.route")(app);
  patient = require("./patient.route")(app);
  doctor = require("./doctor.route")(app);
  appointment = require("./appointment.route")(app);
  note = require("./note.route")(app);
  payment = require("./payment.route")(app);
  procedureCategory = require("./procedureCategory.route")(app);
  procedure = require("./procedure.route")(app);
  notification = require("./notification.route")(app);
  patientProcedure = require("./patientProcedure.route")(app);
  visit = require("./visit.route")(app);
};
