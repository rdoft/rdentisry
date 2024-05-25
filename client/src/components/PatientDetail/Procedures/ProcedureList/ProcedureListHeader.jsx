import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "utils";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import InvoiceTitle from "./InvoiceTitle";
import InvoiceDiscount from "./InvoiceDiscount";
import InvoicePrice from "./InvoicePrice";

// services
import { InvoiceService } from "services";

function ProcedureListHeader({ initInvoice, total, patient }) {
  const navigate = useNavigate();

  const price = useRef(total);
  const [invoice, setInvoice] = useState({
    ...initInvoice,
    price: total * ((100 - initInvoice.discount) / 100),
  });

  useEffect(() => {
    price.current = total;
    setInvoice({
      ...initInvoice,
      price: total * ((100 - initInvoice.discount) / 100),
    });
  }, [total]);

  // SERVICES -----------------------------------------------------------------
  // Save the invoice
  const updateInvoice = async (invoice) => {
    try {
      await InvoiceService.updateInvoice({
        ...invoice,
        patient: patient,
      });

      // Set the updated invoice
      setInvoice(invoice);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onTitleSubmit handler
  const handleTitleSubmit = (value) => {
    updateInvoice({ ...invoice, title: value });
  };

  // onDiscountSubmit handler
  const handleDiscountSubmit = (value) => {
    updateInvoice({
      ...invoice,
      discount: value,
      price: price.current * ((100 - value) / 100),
    });
  };

  // onPriceSubmit handler
  const handlePriceSubmit = (value) => {
    // Calculate the discount
    let discount = 0;
    if (value > price.current || price.current === 0) {
      discount = 0;
      value = price.current;
    } else {
      discount = Math.floor((1 - value / price.current) * 100);
    }

    updateInvoice({
      ...invoice,
      discount: discount,
      price: value,
    });
  };

  return (
    <Grid
      container
      className="invoice-header"
      style={{
        padding: "0 0.2rem",
      }}
    >
      <Grid item xs={9}>
        {/* Tİtle */}
        <InvoiceTitle invoice={invoice} onSubmit={handleTitleSubmit} />
      </Grid>
      <Grid item xs={3} style={{ textAlign: "right" }}>
        {/* Discount */}
        <InvoiceDiscount invoice={invoice} onSubmit={handleDiscountSubmit} />
        {/* Total */}
        <InvoicePrice invoice={invoice} onSubmit={handlePriceSubmit} />
      </Grid>
    </Grid>
  );
}

export default ProcedureListHeader;