import React from "react";
import { Grid } from "@mui/material";
import { Skeleton } from "primereact";

const SkeletonStatistic = () => {
  return (
    <Grid container item xs={8} p={2} alignItems="center">
      <Grid container item xs={8} pr={1} justifyContent="center">
        <Grid item xs={7} mb={1}>
          <Skeleton height="1rem" />
        </Grid>
        <Grid item xs={6} pr={1}>
          <Skeleton height="4rem" />
        </Grid>
        <Grid item xs={6} pl={1}>
          <Skeleton height="4rem" />
        </Grid>

        <Grid item xs={7} pt={2} mb={1}>
          <Skeleton height="1rem" />
        </Grid>
        <Grid item xs={6} pr={1}>
          <Skeleton height="4rem" />
        </Grid>
        <Grid item xs={6} pl={1}>
          <Skeleton height="4rem" />
        </Grid>
      </Grid>

      <Grid container item xs={4} pl={1} justifyContent="center">
        <Skeleton size="8rem" />
      </Grid>
    </Grid>
  );
};

export default SkeletonStatistic;
