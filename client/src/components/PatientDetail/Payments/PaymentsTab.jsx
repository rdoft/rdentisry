import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { Timeline, ProgressBar } from "primereact";
import { calcProgress } from "utils";
import { PaymentDialog } from "components/Dialog";
import NotFoundText from "components/NotFoundText";
import PaymentStatistic from "./PaymentStatistic";
import PaymentMarker from "./PaymentMarker";
import PaymentDateTag from "./PaymentDateTag";
import PaymentContent from "./PaymentContent";

// services
import { PaymentService } from "services";

function PaymentsTab({
  patient,
  paymentDialog,
  showDialog,
  hideDialog,
  counts,
  setCounts,
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
  }, [navigate, patient]);

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
      setCounts({
        ...counts,
        payment: payments.length,
      });
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
  // Payment content template
  const paymentContent = (payment) => {
    return (
      <PaymentContent
        payment={payment}
        onClickEdit={handleSelectPayment}
        onSubmit={savePayment}
        onDelete={deletePayment}
      />
    );
  };

  // Payment dates template
  const paymentDate = (payment) => {
    return (
      <PaymentDateTag
        actual={payment.actualDate}
        planned={payment.plannedDate}
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
        <NotFoundText text="Ödeme yok" p={3} m={3} />
      ) : (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          mt={2}
          pb={4}
        >
          {/* Statistics */}
          <PaymentStatistic
            completedAmount={completedAmount}
            waitingAmount={waitingAmount}
            overdueAmount={overdueAmount}
          />

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
              marker={paymentMarker}
              content={paymentContent}
              opposite={paymentDate}
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
