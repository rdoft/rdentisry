import API from "config/api.config";
const API_URL = "/patients";

let Patient = {};

Patient.getPatients = () => {
  return API.get(API_URL);
};

Patient.savePatient = (patient) => {
  return API.post(API_URL, patient);
};

Patient.deletePatient = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

Patient.deletePatients = (ids) => {
  return API.delete(`${API_URL}?patientId=${ids.join(",")}`);
};

export default Patient;
