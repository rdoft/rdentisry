import React from "react";
import { Grid } from "@mui/material";
import { Skeleton } from "primereact";
import { SkeletonList } from "components/Skeleton";

const SkeletonProceduresTab = ({ tabIndex }) => {
  return (
    tabIndex === 1 && (
      <Grid
        container
        mt={2}
        justifyContent="center"
        sx={{ borderRadius: 2, backgroundColor: "white" }}
      >
        <Grid container item xl={11} xs={10} py={3} justifyContent="center">
          {tabIndex === 1 && (
            <Grid
              container
              item
              justifyContent="space-between"
              alignItems="end"
            >
              <Grid item xs={10} pb={3}>
                <Skeleton width="8rem" height="3rem" />
              </Grid>
              <Grid item alignItems="center" pb={3}>
                <Skeleton width="4rem" height="1.5rem" />
              </Grid>

              <Grid item xs={12}>
                <SkeletonList />
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid item xs="auto" py={3} />
      </Grid>
    )
  );
};

export default SkeletonProceduresTab;
