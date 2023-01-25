import API from "config/api.config";

let Patient = { };

Patient.getAll = () => {
  return API.get("patients");
};

export default Patient;