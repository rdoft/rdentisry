import API from "config/api.config";
const API_URL = "/patients";

let patient = {};

/**
 * Get patient list
 */
patient.getPatients = (payments = null, options = {}) => {
  return API.get(`${API_URL}?payments=${payments}`, options);
};

/**
 * Get patient by id
 * @param id id of the patient
 */
patient.getPatient = (id, options = {}) => {
  return API.get(`${API_URL}/${id}`, options);
};

/**
 * Add a patient
 * @body Patient informations
 */
patient.savePatient = (patient) => {
  return API.post(API_URL, patient);
};

/**
 * Update the patient
 * @param id id of the patient
 * @body Patient informations
 */
patient.updatePatient = (patient) => {
  return API.put(`${API_URL}/${patient.id}`, patient);
};

/**
 * Update patients of the given Ids
 * @query patientId: Id list of patients
 * @body Patient informations
 */
patient.updatePatientsPermission = (ids, permission) => {
  return API.put(`${API_URL}?patientId=${ids.join(",")}`, permission);
};

/**
 * Delete the patient
 * @param id: Id of the patient
 */
patient.deletePatient = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

/**
 * Delete patients of the given Ids
 * @query ids: Id list of patients
 */
patient.deletePatients = (ids) => {
  return API.delete(`${API_URL}?patientId=${ids.join(",")}`);
};

export default patient;
