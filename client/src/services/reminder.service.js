import API from "config/api.config";
const API_URL = "/reminders";

let reminder = {};

/**
 * Add a Reminder to an Appointment
 * @query appointmentId: Id of the Appointment
 */
reminder.remindAppointment = (appointmentId) => {
  return API.post(`${API_URL}/appointments?appointmentId=${appointmentId}`);
};

/**
 * Add a Reminder to a Payment
 * @query patientId: Id of the Patient
 */
reminder.remindPayment = (patientId) => {
  return API.post(`${API_URL}/payments?patientId=${patientId}`);
};

/**
 * Update a reminder field of an Appointment
 * @params {string} token
 * @body {object} action - reminder status of the appointment
 */
reminder.action = (token, action) => {
  return API.put(`${API_URL}/appointments/${token}`, action);
};

export default reminder;
