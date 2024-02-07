import API from "config/api.config";
const API_URL = "/procedures";

let procedure = {};

/**
 * Get the list of the procedures
 * @query categoryId: Category Id
 */
procedure.getProcedures = (categoryId) => {
  if (categoryId) {
    return API.get(`${API_URL}?categoryId=${categoryId}`);
  } else {
    return API.get(API_URL);
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

export default procedure;
