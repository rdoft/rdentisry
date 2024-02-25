import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { CardTitle } from "components/cards";
import { Next, Prev, Cancel } from "components/Button";

function ProcedureToolbar({ selectedTooth, onChangeTooth }) {
  // Add keydown event listener
  // when component mounts and remove it when unmounts
  useEffect(() => {
    // onKeyDown handler to cancel selected tooth
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "Escape":
          onChangeTooth(null);
          document.activeElement.blur();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onChangeTooth]);

  // All theeth numbers
  const theeth = [
    "18",
    "17",
    "16",
    "15",
    "14",
    "13",
    "12",
    "11",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "38",
    "37",
    "36",
    "35",
    "34",
    "33",
    "32",
    "31",
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
    const index = theeth.indexOf(selectedTooth);
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
    const index = theeth.indexOf(selectedTooth);
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
        <Grid item xs={8}>
          {/* All procedure */}
          <CardTitle variant="h3">Tüm Tedaviler</CardTitle>
        </Grid>
      ) : (
        <>
          {/* Prev arrow */}
          <Grid item xs={1}>
            <Prev onClick={handlePrevTooth} />
          </Grid>

          {/* Next arrow */}
          <Grid item xs={1}>
            <Next onClick={handleNextTooth} />
          </Grid>

          {/* Tooth number */}
          <Grid item xs={8}>
            <CardTitle variant="h3">{`Diş ${selectedTooth}`}</CardTitle>
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
