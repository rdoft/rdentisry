import API from "config/api.config";
const API_URL = "/patients";

let patient = {};

/**
 * Get patient list
 */
patient.getPatients = (payments) => {
  return API.get(`${API_URL}?payments=${payments}`);
};

/**
 * Get patient by id
 */
patient.getPatient = (id) => {
  return API.get(`${API_URL}/${id}`);
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

/**
 * Get the procedures of the selected patient
 * @param patientId id of the patient
 * @query tooth: number of the tooth
 * @query completed: flag for completed/noncompleted
 */
patient.getPatientProcedures = (patientId, tooth) => {
  if (tooth) {
    return API.get(`${API_URL}/${patientId}/procedures?tooth=${tooth}`);
  } else {
    return API.get(`${API_URL}/${patientId}/procedures`);
  }
};

export default patient;
