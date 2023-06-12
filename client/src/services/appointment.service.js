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

appointment.updateAppointment = (id, appointment) => {
  return API.put(`${API_URL}/${id}`, appointment);
};

appointment.getAppointments = () => {
  return API.get(API_URL);
};

appointment.getAppointment = (id) => {
  return API.get(`${API_URL}/${id}`);
};

export default appointment;
