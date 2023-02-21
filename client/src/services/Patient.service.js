import API from "config/api.config";

let Patient = { };

Patient.getPatients = () => {
  return API.get("patients");
};

export default Patient;