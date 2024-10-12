import API from "config/api.config";
const API_URL = "/patient-procedures";

let patientProcedure = {};

/**
 * Get the procedures of the selected patient
 * @query patientId id of the patient
 * @query tooth: number of the tooth
 * @query completed: flag for completed/noncompleted
 */
patientProcedure.getPatientProcedures = (
  { patientId, tooth },
  options = {}
) => {
  if (tooth) {
    return API.get(`${API_URL}?patientId=${patientId}&tooth=${tooth}`, options);
  } else {
    return API.get(`${API_URL}?patientId=${patientId}`, options);
  }
};

/**
 * Add a procedure to the patient
 * @query patientId id of the patient
 * @body tooth and procedure informations
 */
patientProcedure.savePatientProcedure = (procedure) => {
  return API.post(`${API_URL}?patientId=${procedure.patient.id}`, procedure);
};

/**
 * Update a procedure to the patient
 * @param patientProcedureId id of the patientprocedure
 * @query patientId id of the patient
 * @body tooth and procedure informations
 */
patientProcedure.updatePatientProcedure = (procedure) => {
  return API.put(
    `${API_URL}/${procedure.id}?patientId=${procedure.patient.id}`,
    procedure
  );
};

/**
 * Delete the procedure of the patient
 * @param id id of the procedure
 */
patientProcedure.deletePatientProcedure = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

export default patientProcedure;
