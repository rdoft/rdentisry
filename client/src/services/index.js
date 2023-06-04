import patient from "services/patient.service";
import doctor from "services/doctor.service";
import appointment from "services/appointment.service";

const PatientService = patient;
const DoctorService = doctor;
const AppointmentService = appointment;

export { PatientService, DoctorService, AppointmentService };
