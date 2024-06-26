import React from "react";
import { Image } from "primereact";
import { Grid } from "@mui/material";

// assets
import { CompletedIcon, InProgressIcon } from "assets/images/icons";

function StatusBadge({ procedures }) {
  let inProgress;
  let completed;

  if (procedures) {
    inProgress = procedures.find((procedure) => !procedure.completedDate);
    completed = procedures.find((procedure) => procedure.completedDate);
  } else {
    inProgress = false;
    completed = false;
  }

  return (
    <>
      <Grid container item justifyContent="center">
        <Image
          src={CompletedIcon}
          width="15px"
          style={{ visibility: completed ? "visible" : "hidden" }}
        />
      </Grid>
      <Grid container item justifyContent="center">
        <Image
          src={InProgressIcon}
          width="15px"
          style={{
            visibility: inProgress ? "visible" : "hidden",
          }}
        />
      </Grid>
    </>
  );
}

export default StatusBadge;
