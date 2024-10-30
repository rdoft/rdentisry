import patient from "./patient.service";
import doctor from "./doctor.service";
import appointment from "./appointment.service";
import payment from "./payment.service";
import notification from "./notification.service";
import note from "./note.service";
import procedure from "./procedure.service";
import patientProcedure from "./patientProcedure.service";
import procedureCategory from "./procedureCategory.service";
import visit from "./visit.service";
import auth from "./auth.service";
import user from "./user.service";
import reminder from "./reminder.service";
import subscription from "./subscription.service";

const PatientService = patient;
const DoctorService = doctor;
const AppointmentService = appointment;
const PaymentService = payment;
const NotificationService = notification;
const NoteService = note;
const ProcedureService = procedure;
const PatientProcedureService = patientProcedure;
const ProcedureCategoryService = procedureCategory;
const VisitService = visit;
const AuthService = auth;
const UserService = user;
const ReminderService = reminder;
const SubscriptionService = subscription;

export {
  PatientService,
  DoctorService,
  AppointmentService,
  PaymentService,
  NotificationService,
  NoteService,
  ProcedureService,
  PatientProcedureService,
  ProcedureCategoryService,
  VisitService,
  AuthService,
  UserService,
  ReminderService,
  SubscriptionService,
};
