import React, { useEffect, useMemo } from "react";
import { Grid } from "@mui/material";
import { CardTitle } from "components/cards";
import { Next, Prev, Cancel } from "components/Button";

function ProcedureToolbar({ selectedTeeth, onChangeTeeth }) {
  // HANDLERS -----------------------------------------------------------------
  // onClickCancel handler to cancel selected tooth
  const handleCancelTooth = () => {
    onChangeTeeth(null);
    // loose focus
    document.activeElement.blur();
  };

  return (
    <Grid container item alignItems="center">
      {selectedTeeth.includes(0) ? (
        <Grid item xs={8}>
          {/* All procedure */}
          <CardTitle variant="h3" style={{ backgroundColor: "transparent" }}>
            Tüm Tedaviler
          </CardTitle>
        </Grid>
      ) : (
        <>
          {/* Tooth number */}
          <Grid item xs={8}>
            {selectedTeeth.map((tooth) => (
              <CardTitle
                variant="h3"
                style={{ backgroundColor: "transparent" }}
              >{`🦷 ${tooth}`}</CardTitle>
            ))}
          </Grid>

          {/* Cancel button */}
          <Grid container item xs={2} justifyContent="end">
            <Cancel onClick={handleCancelTooth} />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default ProcedureToolbar;
