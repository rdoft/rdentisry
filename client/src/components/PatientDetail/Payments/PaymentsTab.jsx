import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { Timeline, ProgressBar } from "primereact";
import { PaymentDialog } from "components/Dialog";
import { calcProgress } from "utils";
import NotFoundText from "components/NotFoundText";
import PaymentCard from "./PaymentCard";
import PaymentMarker from "./PaymentMarker";
import StatisticCard from "./StatisticCard";

// services
import { PaymentService } from "services";

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

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    PaymentService.getPayments(patient.id, { signal })
      .then((res) => {
        setPayments(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    return () => {
      controller.abort();
    };
  }, [navigate, patient, setPayments]);

  // Calculate the payments percentage
  const { progress, completedAmount, waitingAmount, overdueAmount } =
    calcProgress(payments);

  // SERVICES -----------------------------------------------------------------
  // Get the list of payments of the patient and set payments value
  const getPayments = async (patientId) => {
    let response;
    let payments;

    try {
      response = await PaymentService.getPayments(patientId);
      payments = response.data;

      setPayments(payments);
      getCounts();
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
      } else {
        // If create payment, then create payment
        // and reduce from total incase of it is specified
        if (reduce) {
          await reducePayment(payment);
        }
        await PaymentService.savePayment(payment);
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
    let _payments;

    try {
      // If payment is planned or actual date is not specified, then return
      if (payment.id || payment.plannedDate || !payment.actualDate) {
        return;
      }

      amount = payment.amount;
      _payments = payments.filter((_payment) => !_payment.actualDate);

      i = 0;
      while (amount > 0 && i < _payments.length) {
        let currentPayment = _payments[i];
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
    const _payment = payments.find((payment) => payment.id === event.id);

    setPayment(_payment);
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

    // Set the direction of the payment card based on the index
    const idx = payments.findIndex((_payment) => _payment.id === payment.id);
    const direction = idx % 2 === 0 ? "row" : "row-reverse";

    return (
      <PaymentCard
        payment={payment}
        onClickEdit={handleSelectPayment}
        onSubmit={savePayment}
        onDelete={payment && deletePayment}
        direction={direction}
      />
    );
  };

  // Payment marker template
  const paymentMarker = (payment) => {
    return <PaymentMarker payment={payment} />;
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
          {/* Statistics */}
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
              ></StatisticCard>
            </Grid>
            <Grid item xs={2}>
              <StatisticCard
                label={"Kalan"}
                amount={waitingAmount}
              ></StatisticCard>
            </Grid>
            {overdueAmount !== 0 && (
              <Grid item xs={2}>
                <StatisticCard
                  label={"Vadesi Geçen"}
                  amount={overdueAmount}
                ></StatisticCard>
              </Grid>
            )}
          </Grid>

          {/* Progressbar */}
          <Grid item xs={8} pb={6}>
            <ProgressBar
              value={progress}
              color="#22A06A"
              className="border-round-2xl"
              showValue={false}
            ></ProgressBar>
          </Grid>

          {/* Timeline */}
          <Grid item md={8} xs={12}>
            <Timeline
              value={payments}
              align="alternate"
              marker={paymentMarker}
              content={paymentTemplate}
            />
          </Grid>
        </Grid>
      )}

      {/* Payment dialog */}
      {paymentDialog && (
        <PaymentDialog
          initPayment={payment ? payment : { patient }}
          onHide={handleHideDialog}
          onSubmit={savePayment}
          onDelete={payment && deletePayment}
        />
      )}
    </div>
  );
}

export default PaymentsTab;
