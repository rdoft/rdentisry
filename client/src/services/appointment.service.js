import API from "config/api.config";
const API_URL = "/appointments";

let appointment = {};

/**
 * Add a appointment
 * @body appointment informations
 */
appointment.saveAppointment = (appointment) => {
  return API.post(API_URL, appointment);
};

export default appointment;
