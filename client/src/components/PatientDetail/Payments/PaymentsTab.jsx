import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Grid, Tooltip } from "@mui/material";
import { Timeline, Divider } from "primereact";
import { CardTitle } from "components/cards";
import { PaymentDialog, PaymentPlanDialog } from "components/Dialog";
import { NewItem } from "components/Button";
import { NotFoundText } from "components/Text";
import { calcProgress } from "utils";
import PaymentStatistic from "./PaymentStatistic";
import PaymentMarker from "./PaymentMarker";
import PaymentDateTag from "./PaymentDateTag";
import PaymentContent from "./PaymentContent";

// assets
import "assets/styles/PatientDetail/PaymentsTab.css";

// services
import {
  PaymentService,
  VisitService,
  PatientProcedureService,
} from "services";

function PaymentsTab({
  patient,
  paymentDialog,
  showDialog,
  hideDialog,
  counts,
  setCounts,
}) {
  // Set the default values
  const [total, setTotal] = useState(0);
  const [completedTotal, setCompletedTotal] = useState(0);
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
        error.message && toast.error(error.message);
      });

    // Set planned payments
    PaymentService.getPayments(patient.id, true, { signal })
      .then((res) => {
        setPlannedPayments(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        error.message && toast.error(error.message);
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
        error.message && toast.error(error.message);
      });

    PatientProcedureService.getPatientProcedures(
      { patientId: patient.id },
      { signal }
    )
      .then((res) => {
        setCompletedTotal(
          res.data.reduce(
            (acc, procedure) =>
              acc +
              (procedure.visit.approvedDate && procedure.completedDate
                ? procedure.price
                : 0) *
                ((100 - procedure.visit.discount) / 100),
            0
          )
        );
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        error.message && toast.error(error.message);
      });

    return () => {
      controller.abort();
    };
  }, [patient]);

  // Calculate the payments percentage
  const {
    completedAmount,
    remainingAmount,
    overdueAmount,
    waitingAmount,
    overpaidAmount,
    deptAmount,
  } = calcProgress(payments, plannedPayments, total, completedTotal);

  // SERVICES -----------------------------------------------------------------
  // Get the list of payments of the patient and set payments value
  const getPayments = async (patientId) => {
    let response;
    let countPayment = { pending: 0, completed: 0 };

    try {
      response = await PaymentService.getPayments(patientId);
      setPayments(response.data);

      response = await PaymentService.getPayments(patientId, true);
      response.data.forEach((payment) => {
        payment.paid === payment.amount
          ? countPayment.completed++
          : countPayment.pending++;
      });
      setPlannedPayments(response.data);
      setCounts({
        ...counts,
        payment: { ...countPayment },
      });
    } catch (error) {
      error.message && toast.error(error.message);
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
      error.message && toast.error(error.message);
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
      error.message && toast.error(error.message);
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
      error.message && toast.error(error.message);
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

  // Payment plan error tooltip
  const paymentPlanTitle = () => {
    let message;

    if (remainingAmount > waitingAmount) {
      message =
        "Fazla ödeme planı bulunmaktadır. Lütfen ödeme planını veya ödemeleri kontrol edin.";
    } else if (remainingAmount < waitingAmount || 0 < overpaidAmount) {
      message =
        "Eksik ödeme planı bulunmaktadır. Lütfen ödeme planını veya ödemeleri kontrol edin.";
    }

    return message ? (
      <Tooltip title={message} placement="right">
        <div>
          Ödeme Planı
          <i
            className="pi pi-exclamation-triangle pl-3"
            style={{ color: "#EF4444" }}
          ></i>
        </div>
      </Tooltip>
    ) : (
      "Ödeme Planı"
    );
  };

  return (
    <>
      <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
        <Grid container alignItems="center" justifyContent="center" mt={2}>
          {/* Statistics */}
          <PaymentStatistic
            total={total}
            completedTotal={completedTotal}
            completed={completedAmount}
            waiting={waitingAmount}
            overdue={overdueAmount}
            dept={deptAmount}
          />

          {/* Timeline */}
          <Grid container justifyContent="center" alignItems="start">
            <Grid item xs={9} m={1}>
              <Divider />
            </Grid>

            {/* PaymentPlan Timeline */}
            <Grid
              container
              item
              xl={5}
              xs={6}
              px={1}
              py={3}
              justifyContent="center"
            >
              <Grid item xs="auto">
                <CardTitle style={{ textAlign: "center", marginBottom: 5 }}>
                  {paymentPlanTitle()}
                </CardTitle>
              </Grid>
              <Grid item xs={12}>
                {plannedPayments.length === 0 ? (
                  <NotFoundText
                    text="Ödeme planı yok"
                    style={{ backgroundColor: "#F5F5F5" }}
                  />
                ) : (
                  <Timeline
                    value={plannedPayments}
                    marker={paymentMarker}
                    content={paymentContent}
                    opposite={paymentDate}
                  />
                )}
              </Grid>
              {/* Add payment plan */}
              <NewItem label="Ödeme Planı Ekle" onClick={handlePlanDialog} />
            </Grid>

            {/* Payment Timeline */}
            <Grid
              container
              item
              md={5}
              xs={6}
              px={1}
              py={3}
              justifyContent="center"
            >
              <Grid item xs="auto">
                <CardTitle style={{ textAlign: "center", marginBottom: 5 }}>
                  Ödemeler
                </CardTitle>
              </Grid>
              <Grid item xs={12}>
                {payments.length === 0 ? (
                  <NotFoundText
                    text="Ödeme yok"
                    style={{ backgroundColor: "#F5F5F5" }}
                  />
                ) : (
                  <Timeline
                    value={payments}
                    marker={paymentMarker}
                    content={paymentContent}
                    opposite={paymentDate}
                  />
                )}
              </Grid>

              {/* Add payment */}
              <NewItem label="Ödeme Ekle" onClick={handlePaymentDialog} />
            </Grid>
          </Grid>
        </Grid>
      </div>

      {/* Payment dialog */}
      {paymentDialog === "payment" && (
        <PaymentDialog
          initPayment={payment ? payment : { patient, amount: waitingAmount }}
          onHide={handleHideDialog}
          onSubmit={savePayment}
          onDelete={payment && deletePayment}
        />
      )}

      {/* Payment Plan Dialog */}
      {paymentDialog === "plan" && (
        <PaymentPlanDialog
          patient={patient}
          initAmount={Math.max(
            0,
            overpaidAmount + waitingAmount - remainingAmount
          )}
          onHide={handleHideDialog}
          onSubmit={savePayments}
        />
      )}
    </>
  );
}

export default PaymentsTab;
