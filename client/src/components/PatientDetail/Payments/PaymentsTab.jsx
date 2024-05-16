import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { Timeline, ProgressBar } from "primereact";
import { calcProgress, calcCompletedPayment } from "utils";
import { CardTitle } from "components/cards";
import { PaymentDialog, PaymentPlanDialog } from "components/Dialog";
import { NewItem } from "components/Button";
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
  const [payment, setPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [plannedPayments, setPlannedPayments] = useState([]);

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    PaymentService.getPayments(patient.id, { signal })
      .then((res) => {
        // Set the payments and planned payments
        let payments = res.data.filter((payment) => payment.actualDate);
        let plannedPayments = res.data.filter((payment) => payment.plannedDate);
        plannedPayments = calcCompletedPayment(payments, plannedPayments);

        setPayments(payments);
        setPlannedPayments(plannedPayments);
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
    calcProgress(payments, plannedPayments);

  // SERVICES -----------------------------------------------------------------
  // Get the list of payments of the patient and set payments value
  const getPayments = async (patientId) => {
    let response;
    let payments;
    let plannedPayments;

    try {
      response = await PaymentService.getPayments(patientId);
      payments = response.data.filter((payment) => payment.actualDate);
      plannedPayments = response.data.filter((payment) => payment.plannedDate);
      plannedPayments = calcCompletedPayment(payments, plannedPayments);

      setPayments(payments);
      setPlannedPayments(plannedPayments);
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
  const savePayment = async (payment) => {
    try {
      // If update payment, then update and return
      if (payment.id) {
        await PaymentService.updatePayment(payment.id, payment);
      } else {
        // If create payment, then create payment
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

  // Save payments (create)
  const savePayments = async (payments) => {
    try {
      // Create all payments
      for (let payment of payments) {
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
    const _payment =
      payments.find((payment) => payment.id === event.id) ||
      plannedPayments.find((payment) => payment.id === event.id);

    setPayment(_payment);
    setTimeout(showDialog, 100);
  };

  // onHide handler
  const handleHideDialog = () => {
    setPayment(null);
    hideDialog();
  };

  // onShowDialog handlers
  const handlePaymentDialog = () => {
    showDialog("payment");
  };
  const handlePlanDialog = () => {
    showDialog("plan");
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
    return <PaymentDateTag payment={payment} />;
  };

  // Payment marker template
  const paymentMarker = (payment) => {
    return <PaymentMarker payment={payment} />;
  };

  return (
    <>
      <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
        {(payments.length === 0) & (plannedPayments.length === 0) ? (
          <NotFoundText text="Ödeme yok" p={3} m={3} />
        ) : (
          <Grid container alignItems="center" justifyContent="center" mt={2}>
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
            <Grid container item md={10} xs={12} justifyContent="center">
              <Grid item md={5} xs={6}>
                <CardTitle
                  style={{ textAlign: "center", marginBottom: 5, marginX: 20 }}
                >
                  Ödeme Planı
                </CardTitle>
                <Timeline
                  value={plannedPayments}
                  marker={paymentMarker}
                  content={paymentContent}
                  opposite={paymentDate}
                />
              </Grid>
              <Grid item md={5} xs={6}>
                <CardTitle
                  style={{ textAlign: "center", marginBottom: 5, marginX: 20 }}
                >
                  Ödemeler
                </CardTitle>
                <Timeline
                  value={payments}
                  marker={paymentMarker}
                  content={paymentContent}
                  opposite={paymentDate}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>

      <Grid container justifyContent="center" mt={3}>
        <Grid item xs={6} md={4}>
          {/* Add payment */}
          <NewItem label="Ödeme Planı Ekle" onClick={handlePlanDialog} />
        </Grid>
        <Grid item xs={6} md={4}>
          {/* Add payment Plan */}
          <NewItem label="Ödeme Ekle" onClick={handlePaymentDialog} />
        </Grid>
      </Grid>

      {/* Payment dialog */}
      {paymentDialog === "payment" && (
        <PaymentDialog
          initPayment={payment ? payment : { patient }}
          onHide={handleHideDialog}
          onSubmit={savePayment}
          onDelete={payment && deletePayment}
        />
      )}

      {/* Payment Plan Dialog */}
      {paymentDialog === "plan" && (
        <PaymentPlanDialog
          patient={patient}
          onHide={handleHideDialog}
          onSubmit={savePayments}
        />
      )}
    </>
  );
}

export default PaymentsTab;
