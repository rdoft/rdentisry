const UPCOMMING = 2; // Days of upcoming payment

// Process the payments of the patients
const processPatientsPayments = (patients, payments, all = true) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + UPCOMMING);
  const paymentMap = {};
  let totalPaid;

  // Create a map of patientId to total planned payment amount
  for (const payment of payments) {
    paymentMap[payment.patientId] = payment.total;
  }

  for (const patient of patients) {
    totalPaid = paymentMap[patient.id] || 0;

    // Reduce the paymentPlans as much as payments amount
    for (let plan of patient.paymentPlans) {
      if (plan.amount <= totalPaid) {
        totalPaid -= plan.amount;
        plan.paid = plan.amount;
      } else {
        plan.paid = totalPaid;
        totalPaid = 0; // Fully reduced
      }
    }

    // Set overdue status and upcoming status
    if (all) {
      patient.overdue = patient.paymentPlans.some(
        (plan) =>
          plan.amount - plan.paid > 0 &&
          new Date(plan.plannedDate).setHours(0, 0, 0, 0) <
            today.setHours(0, 0, 0, 0)
      );
      patient.upcoming = patient.paymentPlans.some(
        (plan) =>
          plan.amount - plan.paid > 0 &&
          today.setHours(0, 0, 0, 0) <=
            new Date(plan.plannedDate).setHours(0, 0, 0, 0) &&
          new Date(plan.plannedDate).setHours(0, 0, 0, 0) <
            tomorrow.setHours(0, 0, 0, 0)
      );
    } else {
      patient.overdue = patient.paymentPlans.some(
        (plan) =>
          plan.amount - plan.paid > 0 &&
          new Date(plan.plannedDate).setHours(0, 0, 0, 0) ===
            today.setHours(0, 0, 0, 0)
      );
      patient.upcoming = patient.paymentPlans.some(
        (plan) =>
          plan.amount - plan.paid > 0 &&
          today.setHours(0, 0, 0, 0) <=
            new Date(plan.plannedDate).setHours(0, 0, 0, 0) &&
          new Date(plan.plannedDate).setHours(0, 0, 0, 0) <
            tomorrow.setHours(0, 0, 0, 0)
      );
    }
  }

  return patients;
};

// Process the payment plans of the patient
const processPatientPayments = (paymentPlans, totalPaid = 0) => {
  // Reduce the paymentPlans as much as payments amount
  for (let plan of paymentPlans) {
    if (plan.amount <= totalPaid) {
      totalPaid -= plan.amount;
      plan.paid = plan.amount;
    } else {
      plan.paid = totalPaid;
      totalPaid = 0; // Fully reduced
    }
  }

  return paymentPlans;
};

module.exports = {
  processPatientPayments,
  processPatientsPayments,
};
