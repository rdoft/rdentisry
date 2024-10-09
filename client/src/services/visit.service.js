import API from "config/api.config";
const API_URL = "/visits";

let visit = {};

/**
 * Get visits for a given patientId
 * @query patientId id of the patient
 */
visit.getVisits = (patientId, approved = null, options = {}) => {
  return API.get(
    `${API_URL}?patientId=${patientId}&approved=${approved}`,
    options
  );
};

/**
 * Save the visit to the patient
 * @query patientId id of the patient
 * @body patientProcedures list of patient procedures
 */
visit.saveVisit = (patientId, patientProcedures) => {
  return API.post(`${API_URL}?patientId=${patientId}`, {
    patientProcedures,
  });
};

/**
 * Update the visit to the patient
 * @param visitId id of the visit
 * @query patientId id of the patient
 * @body visit informations
 */
visit.updateVisit = (visit) => {
  return API.put(`${API_URL}/${visit.id}?patientId=${visit.patient.id}`, visit);
};

/**
 * Delete the visit of the patient
 * @param id id of the visit
 */
visit.deleteVisit = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

export default visit;
