import React from "react";
import { Grid } from "@mui/material";
import ProcedureToolbar from "components/PatientDetail/Procedures/ProcedureToolbar";
import NotFoundText from "components/NotFoundText";

function ProcedureTable({}) {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Grid item pb={2}>
          <ProcedureToolbar selectedTooth={1} onChangeTooth={() => {}} />
        </Grid>
        {[].length === 0 ? (
          <NotFoundText text={"Tedavi yok"} p={3} />
        ) : (
          <Grid item>{}</Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ProcedureTable;
