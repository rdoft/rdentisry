import API from "config/api.config";
const API_URL = "";

let visit = {};

/**
 * Get visits for a given patientId
 * @param patientId id of the patient
 */
visit.getVisits = (patientId, approved = null, options = {}) => {
  return API.get(
    `${API_URL}/patients/${patientId}/visits?approved=${approved}`,
    options
  );
};

/**
 * Save the visit to the patient
 * @param patientId id of the patient
 * @body patientProcedures list of patient procedures
 */
visit.saveVisit = (patientId, patientProcedures) => {
  return API.post(`${API_URL}/patients/${patientId}/visits`, {
    patientProcedures,
  });
};

/**
 * Update the visit to the patient
 * @param patientId id of the patient
 * @param visitId id of the visit
 * @body visit informations
 */
visit.updateVisit = (visit) => {
  return API.put(
    `${API_URL}/patients/${visit.patient.id}/visits/${visit.id}`,
    visit
  );
};

/**
 * Delete the visit of the patient
 * @param patientId id of the patient
 * @param id id of the visit
 */
visit.deleteVisit = (patientId, id) => {
  return API.delete(`${API_URL}/patients/${patientId}/visits/${id}`);
};

export default visit;
