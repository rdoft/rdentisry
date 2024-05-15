// Calculate the progress of al payments
const calcProgress = (payments, plannedPayments) => {
  let total = 0;
  let overdue = 0;
  let waiting = 0;
  let progress = 0;
  let completed = 0;

  // Calc completed payment
  completed = payments.reduce((acc, payment) => {
    return acc + payment.amount;
  }, 0);

  for (let payment of plannedPayments) {
    // Calc overdue payment
    if (new Date(payment.plannedDate) < new Date()) {
      overdue += payment.amount;
    }
    // Calc total payment
    total += payment.amount;
  }

  overdue = overdue - completed;
  waiting = total - completed;
  overdue = overdue < 0 ? 0 : overdue;
  waiting = waiting < 0 ? 0 : waiting;

  progress = total > 0 ? Math.floor((completed / total) * 100) : 0;

  return {
    progress,
    completedAmount: completed,
    waitingAmount: waiting,
    overdueAmount: overdue,
  };
};

export default calcProgress;
