import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { Timeline, ProgressBar } from "primereact";
import { errorHandler } from "utils/errorHandler";
import PaymentDialog from "./PaymentDialog";
import PaymentCard from "./PaymentCard";
import PaymentMarker from "./PaymentMarker";
import StatisticCard from "./StatisticCard";

// services
import { PaymentService } from "services";
import NotFoundText from "components/NotFoundText";

function PaymentsTab({
  patient,
  paymentDialog,
  showDialog,
  hideDialog,
  getCounts,
}) {
  const navigate = useNavigate();

  // Set the default values
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [waitingAmount, setWaitingAmount] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);

  // Set the page on loading
  useEffect(() => {
    getPayments(patient.id);
    calcProgress();
  }, [patient]);

  // Set the progress of payments
  useEffect(() => {
    calcProgress();
    getCounts();
  }, [payments]);

  // Calculate the payments percentage
  const calcProgress = () => {
    let total = 0;
    let overdue = 0;
    let completed = 0;
    let progress = 0;

    for (let payment of payments) {
      // Calc completed payment
      if (payment.actualDate) {
        completed += payment.amount;
      } else {
        // Calc overdue payment
        if (payment.plannedDate && new Date(payment.plannedDate) < new Date()) {
          overdue += payment.amount;
        }
      }
      // Calc total payment
      total += payment.amount;
    }

    progress = total > 0 ? Math.floor((completed / total) * 100) : 0;
    setProgress(progress);
    setCompletedAmount(completed);
    setWaitingAmount(total - completed);
    setOverdueAmount(overdue);
  };

  // SERVICES -----------------------------------------------------------------
  // Get the list of payments of the patient and set payments value
  const getPayments = async (patientId) => {
    let response;
    let payments;

    try {
      response = await PaymentService.getPayments(patientId);
      payments = response.data;

      setPayments(payments);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Save payment (create/update)
  const savePayment = async (payment, reduce) => {
    try {
      // If update payment, then update and return
      if (payment.id) {
        await PaymentService.updatePayment(payment.id, payment);
        toast.success("Ödeme bilgileri başarıyla güncellendi!");
      } else {
        // If create payment, then create payment
        // and reduce from total incase of it is specified
        if (reduce) {
          await reducePayment(payment);
        }
        await PaymentService.savePayment(payment);
        toast.success("Yeni ödeme başarıyla kaydedildi!");
      }

      // Get and set the updated list of payments
      getPayments(patient.id);
      hideDialog();
      setPayment(null);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Reduce payment
  const reducePayment = async (payment) => {
    let i;
    let amount;
    let payments_;

    try {
      // If payment is planned or actual date is not specified, then return
      if (payment.id || payment.plannedDate || !payment.actualDate) {
        return;
      }

      amount = payment.amount;
      payments_ = payments.filter((payment_) => !payment_.actualDate);

      i = 0;
      while (amount > 0 && i < payments_.length) {
        let currentPayment = payments_[i];
        let currentAmount = currentPayment.amount;

        // Delete planned payments and reduce paid amount until amount is zero
        if (currentAmount <= amount) {
          amount -= currentAmount;
          await PaymentService.deletePayment(currentPayment.id);
        } else {
          currentPayment.amount -= amount;
          amount = 0;
          await PaymentService.updatePayment(currentPayment.id, currentPayment);
        }

        i++;
      }
    } catch (error) {
      throw error;
    }
  };

  //  Delete appointment
  const deletePayment = async (payment) => {
    try {
      await PaymentService.deletePayment(payment.id);

      // Get and set the updated list of payments
      getPayments(patient.id);
      hideDialog();
      setPayment(null);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onSelectEvent, get payment and show dialog
  const handleSelectPayment = async (event) => {
    const payment_ = payments.find((payment) => payment.id === event.id);
    setPayment(payment_);

    setTimeout(showDialog, 100);
  };

  // onHide handler
  const handleHideDialog = () => {
    setPayment(null);
    hideDialog();
  };

  // TEMPLATES ----------------------------------------------------------------
  const paymentTemplate = (payment) => {
    if (!payment) {
      return;
    }

    const idx = payments.findIndex((item) => item.id === payment.id);
    const direction = idx % 2 === 0 ? "row" : "row-reverse";

    return (
      <PaymentCard
        payment={payment}
        onClickEdit={handleSelectPayment}
        onClickPay={savePayment}
        direction={direction}
      />
    );
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
      {payments.length === 0 ? (
        <NotFoundText text="Ödeme yok" p={3} />
      ) : (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          mt={2}
          pb={4}
        >
          <Grid
            container
            item
            xs={12}
            p={2}
            spacing={3}
            justifyContent="center"
          >
            <Grid item xs={2}>
              <StatisticCard
                label={"Ödenen"}
                amount={completedAmount}
                backgroundColor="#DFFCF0"
                color="#22A069"
              ></StatisticCard>
            </Grid>
            <Grid item xs={2}>
              <StatisticCard
                label={"Kalan"}
                amount={waitingAmount}
                backgroundColor="#E8F0FF"
                color="#1E7AFC"
              ></StatisticCard>
            </Grid>
            {overdueAmount !== 0 && (
              <Grid item xs={2}>
                <StatisticCard
                  label={"Vadesi Geçen"}
                  amount={overdueAmount}
                  backgroundColor="#FFD2CB"
                  color="#EF4444"
                ></StatisticCard>
              </Grid>
            )}
          </Grid>
          <Grid item xs={8} pb={6}>
            <ProgressBar
              value={progress}
              color="#22A06A"
              className="border-round-2xl"
              showValue={false}
            ></ProgressBar>
          </Grid>
          <Grid item md={8} xs={12}>
            <Timeline
              value={payments}
              align="alternate"
              marker={(payment) => <PaymentMarker payment={payment} />}
              content={paymentTemplate}
            />
          </Grid>
        </Grid>
      )}
      {paymentDialog && (
        <PaymentDialog
          _payment={payment ? payment : { patient }}
          onHide={handleHideDialog}
          onSubmit={savePayment}
          onDelete={payment && deletePayment}
        />
      )}
    </div>
  );
}

export default PaymentsTab;
