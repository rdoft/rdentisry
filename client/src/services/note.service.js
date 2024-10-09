import API from "config/api.config";
const API_URL = "/notes";

let note = {};

note.saveNote = (note) => {
  return API.post(API_URL, note);
};

note.updateNote = (id, note) => {
  return API.put(`${API_URL}/${id}`, note);
};

note.getNotes = (patientId, options = {}) => {
  return API.get(`${API_URL}?patientId=${patientId}`, options);
};

note.getNote = (id) => {
  return API.get(`${API_URL}/${id}`);
};

note.deleteNote = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

export default note;
