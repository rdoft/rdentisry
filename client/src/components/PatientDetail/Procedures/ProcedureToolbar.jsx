import React from "react";
import { Grid } from "@mui/material";
import { CardTitle } from "components/cards";
import { PressKeyText } from "components/Text";
import { Tooth } from "components/Button";

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
              <Tooth
                key={tooth}
                number={tooth}
                removable
                onRemove={() => handleRemoveTooth(tooth)}
              />
            ))}
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default ProcedureToolbar;
