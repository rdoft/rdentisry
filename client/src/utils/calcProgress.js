// Calculate the progress of al payments
const calcProgress = (payments, plannedPayments, total) => {
  let overdue = 0;
  let waiting = 0;
  let progress = 0;
  let remaining = 0;
  let completed = 0;

  // Calc completed payment
  completed = payments.reduce((acc, payment) => {
    return acc + payment.amount;
  }, 0);

  for (let plannedPayment of plannedPayments) {
    // Calc overdue payment
    if (new Date(plannedPayment.plannedDate) < new Date()) {
      overdue += plannedPayment.amount - plannedPayment.paid;
    }
    // Calc waiting payment
    waiting += plannedPayment.amount - plannedPayment.paid;
  }

  remaining = total - completed > 0 ? total - completed : 0;
  progress =
    total > 0 ? Math.floor((completed / total) * 100) : completed > 0 ? 100 : 0;

  return {
    progress,
    completedAmount: completed,
    remainingAmount: remaining,
    overdueAmount: overdue,
    waitingAmount: waiting,
  };
};

export default calcProgress;
