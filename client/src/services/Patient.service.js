import API from "config/api.config";
const API_URL = "/patients";

let patient = {};

/**
 * Get patient list
 */
patient.getPatients = () => {
  return API.get(API_URL);
};

/**
 * Add a patient
 * @body Patient informations
 */
patient.savePatient = (patient) => {
  return API.post(API_URL, patient);
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
 * If ids not given then delete all patients
 * @query ids: Id list of patients
 */
patient.deletePatients = (ids) => {
  return API.delete(`${API_URL}?patientId=${ids.join(",")}`);
};

export default patient;
