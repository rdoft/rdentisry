import React from "react";
import { Chip } from "primereact";
import { Grid } from "@mui/material";
import { CardTitle } from "components/cards";
import { PressKeyText } from "components/Text";

function ProcedureToolbar({ selectedTeeth, onChangeTeeth }) {
  // HANDLERS -----------------------------------------------------------------
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
          {/* Information note */}
          <Grid item xs={12} textAlign="center">
            <PressKeyText
              text="Tüm seçimleri kaldırmak için ESC tıklayın"
              keypad="ESC"
            />
          </Grid>

          <Grid item xs={12}>
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
        </>
      )}
    </Grid>
  );
}

export default ProcedureToolbar;
