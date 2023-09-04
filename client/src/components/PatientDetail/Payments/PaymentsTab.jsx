import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";

import PaymentDialog from "./PaymentDialog";

function PaymentsTab({ patient, paymentDialog, showDialog, hideDialog }) {
  // Set the default values
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(null);

  // HANDLERS -----------------------------------------------------------------
  // onHide handler
  const handleHideDialog = () => {
    setPayment(null);
    hideDialog();
  };

  return (
    <>
      {paymentDialog && (
        <PaymentDialog
          _payment={payment ? payment : { patient }}
          onHide={handleHideDialog}
          // onSubmit={savePayment}
          // onDelete={payment && deletePayment}
        />
      )}
    </>
  );
}

export default PaymentsTab;
