module.exports = (app) => {
  patient = require("./patient.route")(app);
  doctor = require("./doctor.route")(app);
}