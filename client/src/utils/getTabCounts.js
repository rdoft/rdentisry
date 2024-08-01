import {
  AppointmentService,
  NoteService,
  PatientProcedureService,
  PaymentService,
} from "services";

// Get all tabs counts based on the patient
const getTabCounts = async (patient) => {
  let counts = {
    appointment: { pending: 0, completed: 0 },
    payment: { completed: 0 },
    note: { other: 0 },
    procedure: { pending: 0, completed: 0 },
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
      appointment.status === "active"
        ? counts.appointment.pending++
        : counts.appointment.completed++;
    });
    // Count the procedures based on its status
    procedures.data.forEach((procedure) => {
      procedure.completedDate
        ? counts.procedure.completed++
        : counts.procedure.pending++;
    });
    // Count the payments
    counts.payment.completed = payments.data.length ?? 0;
    // Count the notes
    counts.note.other = notes.data.length ?? 0;

    return counts;
  } catch (error) {
    throw error;
  }
};

export default getTabCounts;
