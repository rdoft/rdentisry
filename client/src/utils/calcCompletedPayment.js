// Calculate the plannedPatiens paid percentage
const calcCompletedPayment = (payments, plannedPayments) => {
  let _paid = 0;
  let paid = payments.reduce((acc, payment) => {
    return acc + payment.amount;
  }, 0);

  return plannedPayments.map((payment) => {
    if (paid >= payment.amount) {
      paid -= payment.amount;
      return {
        ...payment,
        paid: payment.amount,
      };
    } else {
      _paid = paid;
      paid = 0;
      return {
        ...payment,
        paid: _paid,
      };
    }
  });
};

export default calcCompletedPayment;
