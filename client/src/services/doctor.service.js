import API from "config/api.config";
const API_URL = "/doctors";

let doctor = {};

/**
 * Get doctor list
 */
doctor.getDoctors = (options = {}) => {
  return API.get(API_URL, options);
};

/**
 * Add a doctor
 * @body Doctor informations
 */
doctor.saveDoctor = (doctor) => {
  return API.post(API_URL, doctor);
};

/**
 * Update the doctor
 * @param id id of the doctor
 * @body Doctor informations
 */
doctor.updateDoctor = (doctor) => {
  return API.put(`${API_URL}/${doctor.id}`, doctor);
};

/**
 * Delete the doctor
 * @param id: Id of the doctor
 */
doctor.deleteDoctor = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

export default doctor;
