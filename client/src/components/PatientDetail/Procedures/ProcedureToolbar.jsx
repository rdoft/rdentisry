import React from "react";
import { Button } from "primereact";
import { Grid, Typography } from "@mui/material";

function ProcedureToolbar({ selectedTooth, onChangeTooth }) {
  // All theeth numbers
  const theeth = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
  ];

  // HANDLERS -----------------------------------------------------------------
  // onClickNext handler to selct next tooth
  const handleNextTooth = () => {
    let index = theeth.indexOf(selectedTooth);
    if (index < theeth.length - 1) {
      onChangeTooth(theeth[index + 1]);
    } else {
      onChangeTooth(theeth[0]);
    }
    // loose focus
    document.activeElement.blur();
  };

  // onClickNext handler to selct prev tooth
  const handlePrevTooth = () => {
    let index = theeth.indexOf(selectedTooth);
    if (index > 0) {
      onChangeTooth(theeth[index - 1]);
    } else {
      onChangeTooth(theeth[theeth.length - 1]);
    }
    // loose focus
    document.activeElement.blur();
  };

  // onClickCancel handler to cancel selected tooth
  const handleCancelTooth = () => {
    onChangeTooth(null);
    // loose focus
    document.activeElement.blur();
  };

  return (
    <Grid container item alignItems="center">
      {!selectedTooth ? (
        <>
          {/* Tooth number */}
          <Grid item xs={8} m={1}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bolder",
                color: "#182A4D",
              }}
            >
              {`Tüm Tedaviler`}
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          {/* Prev arrow */}
          <Grid item xs={1}>
            <Button
              icon="pi pi-angle-left"
              rounded
              text
              severity="secondary"
              onClick={handlePrevTooth}
            />
          </Grid>
          {/* Next arrow */}
          <Grid item xs={1}>
            <Button
              icon="pi pi-angle-right"
              rounded
              text
              severity="secondary"
              onClick={handleNextTooth}
            />
          </Grid>
          {/* Tooth number */}
          <Grid item xs={8}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bolder",
                color: "#182A4D",
              }}
            >
              {`Diş ${selectedTooth}`}
            </Typography>
          </Grid>
          {/* Cancel button */}
          <Grid container item xs={2} justifyContent="end">
            <Button
              icon="pi pi-times"
              rounded
              text
              severity="secondary"
              onClick={handleCancelTooth}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default ProcedureToolbar;
