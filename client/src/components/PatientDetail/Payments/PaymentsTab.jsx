import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { useNavigate } from "react-router-dom";
import { Grid, Tooltip } from "@mui/material";
import { Timeline, ProgressBar } from "primereact";
import { CardTitle } from "components/cards";
import { PaymentDialog, PaymentPlanDialog } from "components/Dialog";
import { NewItem } from "components/Button";
import { calcProgress } from "utils";
import PaymentStatistic from "./PaymentStatistic";
import PaymentMarker from "./PaymentMarker";
import PaymentDateTag from "./PaymentDateTag";
import PaymentContent from "./PaymentContent";

// assets
import "assets/styles/PatientDetail/PaymentsTab.css";

// services
import { PaymentService, VisitService } from "services";

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
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [plannedPayments, setPlannedPayments] = useState([]);

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Set the payments
    PaymentService.getPayments(patient.id, false, { signal })
      .then((res) => {
        setPayments(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    // Set planned payments
    PaymentService.getPayments(patient.id, true, { signal })
      .then((res) => {
        setPlannedPayments(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    // Set total payment
    VisitService.getVisits(patient.id, true, { signal })
      .then((res) => {
        setTotal(
          res.data.reduce(
            (acc, visit) => acc + visit.price * ((100 - visit.discount) / 100),
            0
          )
        );
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
  const {
    progress,
    completedAmount,
    remainingAmount,
    overdueAmount,
    waitingAmount,
  } = calcProgress(payments, plannedPayments, total);

  // SERVICES -----------------------------------------------------------------
  // Get the list of payments of the patient and set payments value
  const getPayments = async (patientId) => {
    let response;
    let countPayment;

    try {
      response = await PaymentService.getPayments(patientId);
      countPayment = response.data.length;
      setPayments(response.data);
      response = await PaymentService.getPayments(patientId, true);
      setPlannedPayments(response.data);

      setCounts({
        ...counts,
        payment: countPayment,
      });
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Save payment (create/update)
  const savePayment = async (payment) => {
    try {
      const plan = payment.plannedDate ? true : false;

      // If update payment, then update and return
      if (payment.id) {
        await PaymentService.updatePayment(payment.id, payment, plan);
      } else {
        // If create payment, then create payment
        await PaymentService.savePayment(payment, plan);
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
        const plan = payment.plannedDate ? true : false;
        await PaymentService.savePayment(payment, plan);
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
      const plan = payment.plannedDate ? true : false;
      await PaymentService.deletePayment(payment.id, plan);

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
    setTimeout(handlePaymentDialog, 100);
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
        <Grid container alignItems="center" justifyContent="center" mt={2}>
          {/* Statistics */}
          <PaymentStatistic
            totalAmount={total}
            completedAmount={completedAmount}
            waitingAmount={remainingAmount}
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
          <Grid container item md={10} xs={12} justifyContent="center" pb={2}>
            {/* PaymentPlan Timeline */}
            <Grid item md={5} xs={6}>
              <CardTitle
                style={{
                  textAlign: "center",
                  marginBottom: 5,
                  marginX: 20,
                }}
              >
                {remainingAmount === waitingAmount ? (
                  "Ödeme Planı"
                ) : (
                  <Tooltip title="Kalan tutar ile bekleyen ödeme planı tutarı uyuşmamaktadır. Lütfen ödeme planını kontrol edin.">
                    <>
                      Ödeme Planı
                      <i
                        className="pi pi-exclamation-triangle pl-3"
                        style={{ color: "#EF4444" }}
                      ></i>
                    </>
                  </Tooltip>
                )}
              </CardTitle>
              <Timeline
                value={plannedPayments}
                marker={paymentMarker}
                content={paymentContent}
                opposite={paymentDate}
              />
              {/* Add payment plan */}
              <NewItem label="Ödeme Planı Ekle" onClick={handlePlanDialog} />
            </Grid>

            {/* Payment Timeline */}
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
              {/* Add payment */}
              <NewItem label="Ödeme Ekle" onClick={handlePaymentDialog} />
            </Grid>
          </Grid>
        </Grid>
      </div>

      {/* Payment dialog */}
      {paymentDialog === "payment" && (
        <PaymentDialog
          initPayment={payment ? payment : { patient, amount: remainingAmount }}
          onHide={handleHideDialog}
          onSubmit={savePayment}
          onDelete={payment && deletePayment}
        />
      )}

      {/* Payment Plan Dialog */}
      {paymentDialog === "plan" && (
        <PaymentPlanDialog
          patient={patient}
          initAmount={remainingAmount}
          onHide={handleHideDialog}
          onSubmit={savePayments}
        />
      )}
    </>
  );
}

export default PaymentsTab;
