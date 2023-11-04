import API from "config/api.config";
const API_URL = "/patients";

let patientProcedure = {};

/**
 * Get the procedures of the selected patient
 * @param patientId id of the patient
 * @query tooth: number of the tooth
 * @query completed: flag for completed/noncompleted
 */
patientProcedure.getPatientProcedures = (patientId, tooth) => {
  if (tooth) {
    return API.get(`${API_URL}/${patientId}/procedures?tooth=${tooth}`);
  } else {
    return API.get(`${API_URL}/${patientId}/procedures`);
  }
};

/**
 * Add a procedure to the patient
 * @param patientId id of the patient
 * @body tooth and procedure informations
 */
patientProcedure.savePatientProcedure = (procedure) => {
  return API.post(`${API_URL}/${procedure.patient.id}/procedures`, procedure);
};

/**
 * Update a procedure to the patient
 * @param patientId id of the patient
 * @param patientProcedureId id of the patientprocedure
 * @body tooth and procedure informations
 */
patientProcedure.updatePatientProcedure = (procedure) => {
  return API.post(
    `${API_URL}/${procedure.patient.id}/procedures/${procedure.id}`,
    procedure
  );
};

/**
 * Delete the procedure of the patient
 * @param id id of the procedure
 */
patientProcedure.deletePatientProcedure = (patientId, id) => {
  return API.delete(`${API_URL}/${patientId}/procedures/${id}`);
};

export default patientProcedure;
