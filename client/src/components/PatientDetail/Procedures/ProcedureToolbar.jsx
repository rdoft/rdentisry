import React from "react";
import { Chip } from "primereact";
import { Grid } from "@mui/material";
import { CardTitle } from "components/cards";
import { Cancel } from "components/Button";

function ProcedureToolbar({ selectedTeeth, onChangeTeeth }) {
  // HANDLERS -----------------------------------------------------------------
  // onClickCancel handler to cancel selected tooth
  const handleCancelTooth = () => {
    onChangeTeeth(null);
    // loose focus
    document.activeElement.blur();
  };

  // onClickRemove handler to remove selected tooth
  const handleRemoveTooth = (tooth) => {
    onChangeTeeth(selectedTeeth.filter((number) => number !== tooth));
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
          <Grid item xs={8}>
            {/* Tooth number */}
            {selectedTeeth.map((tooth) => (
              <Chip
                key={tooth}
                label={tooth ? "🦷 " + tooth : "Genel"}
                removable
                onRemove={() => handleRemoveTooth(tooth)}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #CED4D9",
                  margin: "0.3rem",
                }}
              />
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
