import React from "react";
import { Grid } from "@mui/material";
import { Divider } from "primereact";
import SkeletonStatistic from "./SkeletonStatistic";
import SkeletonTimeline from "./SkeletonTimeline";

const SkeletonPaymentsTab = () => {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
      <Grid container alignItems="center" justifyContent="center" mt={2}>
        <SkeletonStatistic />
      </Grid>

      <Grid container justifyContent="center" alignItems="start">
        <Grid item xs={9} m={1}>
          <Divider />
        </Grid>

        <Grid
          container
          item
          xl={5}
          xs={6}
          px={1}
          py={3}
          justifyContent="center"
        >
          <Grid item xs={12}>
            <SkeletonTimeline />
          </Grid>
        </Grid>

        <Grid
          container
          item
          md={5}
          xs={6}
          px={1}
          py={3}
          justifyContent="center"
        >
          <Grid item xs={12}>
            <SkeletonTimeline />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default SkeletonPaymentsTab;
