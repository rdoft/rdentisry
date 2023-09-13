import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { Timeline, ProgressBar } from "primereact";
import { toastErrorMessage } from "components/errorMesage";
import PaymentDialog from "./PaymentDialog";
import PaymentCard from "./PaymentCard";
import PaymentMarker from "./PaymentMarker";

// services
import { PaymentService } from "services";

function PaymentsTab({ patient, paymentDialog, showDialog, hideDialog }) {
  // Set the default values
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(null);
  const [progress, setProgress] = useState(0);

  // Set the page on loading
  useEffect(() => {
    getPayments(patient.id);
    calcProgress();
  }, [patient]);

  // Set the progress of payments
  useEffect(() => {
    calcProgress();
  }, [payments]);

  // Calculate the payments percentage
  const calcProgress = () => {
    let completed = 0;
    let total = 0;
    let progress = 0;

    for (let payment of payments) {
      if (payment.actualDate) {
        completed += payment.amount;
      }
      total += payment.amount;
    }

    progress = total > 0 ? Math.floor((completed / total) * 100) : 0;
    setProgress(progress);
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
      toast.error(toastErrorMessage(error));
    }
  };

  // Save payment (create/update)
  const savePayment = async (payment) => {
    try {
      if (payment.id) {
        await PaymentService.updatePayment(payment.id, payment);
        toast.success("Ödeme bilgileri başarıyla güncellendi!");
      } else {
        await PaymentService.savePayment(payment);
        toast.success("Yeni ödeme başarıyla kaydedildi!");
      }

      // Get and set the updated list of payments
      getPayments(patient.id);
      hideDialog();
      setPayment(null);
    } catch (error) {
      toast.error(toastErrorMessage(error));
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
      // Set error status and show error toast message
      toast.error(toastErrorMessage(error));
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
    <div style={{ backgroundColor: "#FAFAFB" }}>
      {payments.length === 0 ? (
        <p className="text-center">Ödeme kaydı bulunamadı</p>
      ) : (
        <Grid container alignItems="center" justifyContent="center" pb={4}>
          <Grid item xs={8} p={4}>
            <ProgressBar
              value={progress}
              color="#22A06A"
              className="border-round-2xl"
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
