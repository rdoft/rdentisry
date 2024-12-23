import API from "config/api.config";
const API_URL = "/procedures";

let procedure = {};

/**
 * Get the list of the procedures
 * @query categoryId: Category Id
 */
procedure.getProcedures = (categoryId = null, options = {}) => {
  if (categoryId) {
    return API.get(`${API_URL}?categoryId=${categoryId}`, options);
  } else {
    return API.get(API_URL, options);
  }
};

/**
 * Save the procedure
 * @body Procedure informations
 */
procedure.saveProcedure = (procedure) => {
  return API.post(API_URL, procedure);
};

/**
 * Update the procedure
 * @param id id of the procedure
 * @body Procedure informations
 */
procedure.updateProcedure = (procedure) => {
  return API.put(`${API_URL}/${procedure.id}`, procedure);
};

/**
 * Delete the procedure
 * @param id: Id of the procedure
 */
procedure.deleteProcedure = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

/**
 * Delete procedures of the given Ids
 * @query ids: Id list of procedures
 */
procedure.deleteProcedures = (ids) => {
  return API.delete(`${API_URL}?procedureId=${ids.join(",")}`);
};

export default procedure;
