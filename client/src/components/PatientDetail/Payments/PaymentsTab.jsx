import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Grid, Tooltip } from "@mui/material";
import { Timeline, Divider } from "primereact";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { calcProgress } from "utils";
import { CardTitle } from "components/cards";
import { PaymentDialog, PaymentPlanDialog } from "components/Dialog";
import { Add } from "components/Button";
import { NotFoundText } from "components/Text";
import { LoadingController } from "components/Loadable";
import { SkeletonPaymentsTab } from "components/Skeleton";
import { SubscriptionController } from "components/Subscription";
import PaymentStatistic from "./PaymentStatistic";
import PaymentMarker from "./PaymentMarker";
import PaymentDateTag from "./PaymentDateTag";
import PaymentContent from "./PaymentContent";

// assets
import { useTheme } from "@mui/material/styles";
import "assets/styles/PatientDetail/PaymentsTab.css";

// services
import {
  PaymentService,
  VisitService,
  PatientProcedureService,
  ReminderService,
} from "services";

function PaymentsTab({
  patient,
  paymentDialog,
  showDialog,
  hideDialog,
  counts,
  setCounts,
}) {
  const theme = useTheme();
  const { startLoading, stopLoading } = useLoading();
  const { refresh } = useSubscription();

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

    // Set data on loading
    const fetchAll = async () => {
      startLoading("PaymentsTab");
      try {
        const _payments = await PaymentService.getPayments(patient.id, false, {
          signal,
        });
        setPayments(_payments.data);

        const _plannedPayments = await PaymentService.getPayments(
          patient.id,
          true,
          { signal }
        );
        setPlannedPayments(_plannedPayments.data);

        const _visits = await VisitService.getVisits(patient.id, true, {
          signal,
        });
        setTotal(
          _visits.data.reduce(
            (acc, visit) => acc + visit.price * ((100 - visit.discount) / 100),
            0
          )
        );

        const _procedures = await PatientProcedureService.getPatientProcedures(
          { patientId: patient.id },
          { signal }
        );
        setCompletedTotal(
          _procedures.data.reduce(
            (acc, procedure) =>
              acc +
              (procedure.visit.approvedDate && procedure.completedDate
                ? procedure.price
                : 0) *
                ((100 - procedure.visit.discount) / 100),
            0
          )
        );
      } catch (error) {
        error.message && toast.error(error.message);
      } finally {
        stopLoading("PaymentsTab");
      }
    };
    fetchAll();

    return () => {
      controller.abort();
    };
  }, [patient, startLoading, stopLoading]);

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

    try {
      response = await PaymentService.getPayments(patientId);
      setPayments(response.data);
      setCounts({
        ...counts,
        payment: response.data.length,
      });

      response = await PaymentService.getPayments(patientId, true);
      setPlannedPayments(response.data);
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // Save payment (create/update)
  const savePayment = async (payment) => {
    try {
      startLoading("save");
      const plan = payment.plannedDate ? true : false;

      // If update payment, then update and return
      if (payment.id) {
        await PaymentService.updatePayment(payment.id, payment, plan);
      } else {
        // If create payment, then create payment
        await PaymentService.savePayment(payment, plan);
      }

      // Get and set the updated list of payments
      await getPayments(patient.id);
      hideDialog();
      setPayment(null);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // Save payments (create)
  const savePayments = async (payments) => {
    try {
      startLoading("save");
      // Create all payments
      for (let payment of payments) {
        const plan = payment.plannedDate ? true : false;
        await PaymentService.savePayment(payment, plan);
      }

      // Get and set the updated list of payments
      await getPayments(patient.id);
      hideDialog();
      setPayment(null);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  //  Delete appointment
  const deletePayment = async (payment) => {
    try {
      startLoading("delete");
      const plan = payment.plannedDate ? true : false;
      await PaymentService.deletePayment(payment.id, plan);

      // Get and set the updated list of payments
      await getPayments(patient.id);
      hideDialog();
      setPayment(null);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
    }
  };

  // Send payment reminder
  const sendReminder = async () => {
    try {
      startLoading("send");
      await ReminderService.remindPayment(patient.id);
      refresh();
      toast.success("Ödeme hatırlatma mesajı başarıyla gönderildi");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("send");
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
            style={{ color: theme.palette.text.error }}
          ></i>
        </div>
      </Tooltip>
    ) : (
      "Ödeme Planı"
    );
  };

  return (
    <LoadingController name="PaymentsTab" skeleton={<SkeletonPaymentsTab />}>
      <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
        <Grid container alignItems="center" justifyContent="center" mt={2}>
          {/* Statistics */}
          <PaymentStatistic
            total={total}
            completedTotal={completedTotal}
            completed={completedAmount}
            waiting={waitingAmount}
            remaining={remainingAmount}
            overdue={overdueAmount}
            dept={deptAmount}
            onSendReminder={sendReminder}
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
                    style={{
                      backgroundColor: theme.palette.background.primary,
                    }}
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
              <Grid item xs={12} mt={3} style={{ textAlign: "center" }}>
                <SubscriptionController type="storage">
                  <Add
                    border
                    label="Ödeme Planı Ekle"
                    onClick={handlePlanDialog}
                  />
                </SubscriptionController>
              </Grid>
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
                    style={{
                      backgroundColor: theme.palette.background.primary,
                    }}
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
              <Grid item xs={12} mt={3} style={{ textAlign: "center" }}>
                <SubscriptionController type="storage">
                  <Add
                    border
                    label="Ödeme Ekle"
                    onClick={handlePaymentDialog}
                  />
                </SubscriptionController>
              </Grid>
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
    </LoadingController>
  );
}

export default PaymentsTab;
