import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { useLoading } from "context/LoadingProvider";
import VisitTitle from "./VisitTitle";
import VisitDiscount from "./VisitDiscount";
import VisitPrice from "./VisitPrice";

// services
import { VisitService } from "services";
import VisitStatus from "./VisitStatus";

function ProcedureListHeader({
  initVisit,
  total,
  patient,
  onUpdated,
  setSelectedProcedures,
}) {
  const { startLoading, stopLoading } = useLoading();

  const price = useRef(total);
  const [visit, setVisit] = useState({
    ...initVisit,
    price: total * ((100 - initVisit.discount) / 100),
  });

  useEffect(() => {
    price.current = total;
    setVisit({
      ...initVisit,
      price: total * ((100 - initVisit.discount) / 100),
    });
  }, [total, initVisit]);

  // SERVICES -----------------------------------------------------------------
  // Save the visit
  const updateVisit = async (visit) => {
    try {
      startLoading("save");
      await VisitService.updateVisit({
        ...visit,
        patient: patient,
      });

      // Set the updated visit
      setVisit(visit);
      await onUpdated(patient.id);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onTitleSubmit handler
  const handleTitleSubmit = async (value) => {
    await updateVisit({ ...visit, title: value });
  };

  // onDiscountSubmit handler
  const handleDiscountSubmit = async (value) => {
    await updateVisit({
      ...visit,
      discount: value,
      price: price.current * ((100 - value) / 100),
    });
  };

  // onPriceSubmit handler
  const handlePriceSubmit = async (value) => {
    // Calculate the discount
    let discount = 0;
    if (value > price.current || price.current === 0) {
      discount = 0;
      value = price.current;
    } else {
      discount = (1 - value / price.current) * 100;
    }

    await updateVisit({
      ...visit,
      discount: discount,
      price: value,
    });
  };

  // onStatusSubmit handler
  const handleStatusSubmit = async (value) => {
    setSelectedProcedures(null);
    await updateVisit({
      ...visit,
      approvedDate: value,
    });
  };

  return (
    <Grid
      container
      justifyContent="space-between"
      style={{
        padding: "0 0.2rem",
      }}
    >
      <Grid item xs={8}>
        {/* Title */}
        <VisitTitle visit={visit} onSubmit={handleTitleSubmit} />
        <VisitStatus visit={visit} onSubmit={handleStatusSubmit} />
      </Grid>
      <Grid item xl={3} xs={4}>
        {/* Discount */}
        <VisitDiscount visit={visit} onSubmit={handleDiscountSubmit} />
        {/* Total */}
        <VisitPrice visit={visit} onSubmit={handlePriceSubmit} />
      </Grid>
    </Grid>
  );
}

export default ProcedureListHeader;
