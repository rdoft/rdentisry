module.exports = (app) => {
  patient = require("./patient.route")(app);
  appointment = require("./appointment.route")(app);
}