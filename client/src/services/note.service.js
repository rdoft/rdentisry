import API from "config/api.config";
const API_URL = "/notes";

let note = {};

note.saveNote = (note) => {
  return API.post(API_URL, note);
}

note.updateNote = (id, note) => {
  return API.put(`${API_URL}/${id}`, note);
}

note.getNotes = (patientId) => {
  return API.get(`/patients/${patientId}${API_URL}`);
}

note.getNote = (id) => {
  return API.get(`${API_URL}/${id}`);
}

note.deleteNote = (id) => {
  return API.delete(`${API_URL}/${id}`);
}

export default note;