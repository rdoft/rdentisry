module.exports = (app) => {
  patient = require("./patient.route")(app);
  doctor = require("./doctor.route")(app);
  appointment = require("./appointment.route")(app);
  note = require("./note.route")(app);
  payment = require("./payment.route")(app);
};
