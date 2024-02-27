import API from "config/api.config";
const API_URL = "/procedure-categories";

let procedureCategory = {};

/**
 * Get the list of the procedure categories
 */
procedureCategory.getProcedureCategories = (options = {}) => {
  return API.get(API_URL, options);
};

/**
 * Save the procedure category
 * @body Category informations
 */
procedureCategory.saveProcedureCategory = (category) => {
  return API.post(API_URL, category);
};

/**
 * Delete the procedure category
 * @param id id of the category
 */
procedureCategory.deleteProcedureCategory = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

export default procedureCategory;
