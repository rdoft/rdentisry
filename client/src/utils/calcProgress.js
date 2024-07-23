// Calculate the progress of al payments
const calcProgress = (payments, plannedPayments, total, completedTotal) => {
  let overdue = 0;
  let waiting = 0;
  let remaining = 0;
  let completed = 0;
  let overpaid = 0;
  let dept = 0;

  // Calc completed payment
  completed = payments.reduce((acc, payment) => {
    return acc + payment.amount;
  }, 0);

  // Calc overpaid payment
  overpaid = payments.reduce((acc, payment) => {
    return payment.isPlanned ? acc + payment.amount : acc;
  }, 0);

  for (let plannedPayment of plannedPayments) {
    // Calc overdue payment
    if (new Date(plannedPayment.plannedDate) < new Date()) {
      overdue += plannedPayment.amount - plannedPayment.paid;
    }
    // Calc waiting payment
    waiting += plannedPayment.amount - plannedPayment.paid;
    overpaid -= plannedPayment.paid;
  }

  dept = completedTotal - completed > 0 ? completedTotal - completed : 0;
  remaining = total - completed > 0 ? total - completed : 0;

  return {
    completedAmount: completed,
    remainingAmount: remaining,
    overdueAmount: overdue,
    waitingAmount: waiting,
    overpaidAmount: overpaid,
    deptAmount: dept,
  };
};

export default calcProgress;
