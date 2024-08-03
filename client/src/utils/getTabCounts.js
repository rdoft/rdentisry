import {
  AppointmentService,
  NoteService,
  PatientProcedureService,
  PaymentService,
} from "services";

// Get all tabs counts based on the patient
const getTabCounts = async (patient) => {
  let counts = {
    appointment: 0,
    payment: 0,
    note: 0,
    procedure: 0,
  };

  try {
    const appointments = await AppointmentService.getAppointments({
      patientId: patient.id,
    });
    const payments = await PaymentService.getPayments(patient.id);
    const notes = await NoteService.getNotes(patient.id);
    const procedures = await PatientProcedureService.getPatientProcedures({
      patientId: patient.id,
    });

    // Count the appointments based on its status
    appointments.data.forEach((appointment) => {
      appointment.status === "active" && counts.appointment++;
    });
    // Count the procedures based on its status
    procedures.data.forEach((procedure) => {
      procedure.completedDate && counts.procedure++;
    });
    // Count the payments
    counts.payment = payments.data.length ?? 0;
    // Count the notes
    counts.note = notes.data.length ?? 0;

    return counts;
  } catch (error) {
    throw error;
  }
};

export default getTabCounts;
