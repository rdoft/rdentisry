import API from "config/api.config";
const API_URL = "/appointments";

let appointment = {};

appointment.saveAppointment = (appointment) => {
  return API.post(API_URL, appointment);
};

appointment.updateAppointment = (id, appointment) => {
  return API.put(`${API_URL}/${id}`, appointment);
};

appointment.getAppointments = ({ patientId, doctorId }, options = {}) => {
  if (patientId && doctorId) {
    return API.get(
      `${API_URL}?patientId=${patientId}&doctorId=${doctorId}`,
      options
    );
  }
  if (doctorId) {
    return API.get(`${API_URL}?doctorId=${doctorId}`, options);
  }
  if (patientId) {
    return API.get(`${API_URL}?patientId=${patientId}`, options);
  }
  return API.get(API_URL, options);
};

appointment.getAppointment = (id) => {
  return API.get(`${API_URL}/${id}`);
};

appointment.deleteAppointment = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

export default appointment;
