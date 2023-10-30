import API from "config/api.config";
const API_URL = "/procedures";

let procedure = {};

procedure.getProcedures = (categoryId) => {
  if (categoryId) {
    return API.get(`${API_URL}?categoryId=${categoryId}`);
  } else {
    return API.get(API_URL);
  }
};

export default procedure;
