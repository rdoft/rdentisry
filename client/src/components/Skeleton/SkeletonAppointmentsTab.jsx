import React from "react";
import { Grid } from "@mui/material";
import { Skeleton } from "primereact";
import SkeletonCard from "./SkeletonCard";

const SkeletonAppointmentsTab = () => {
  return (
    <Grid container alignItems="start" justifyContent="space-between" mt={2}>
      <Grid container item md={6} xs={12} justifyContent="center" pr={2}>
        <Grid item xs="auto" my={2}>
          <Skeleton width="6rem" height="2rem" />
        </Grid>

        <Grid
          item
          xs={12}
          px={1}
          py={3}
          sx={{ backgroundColor: "white", borderRadius: "8px" }}
        >
          <SkeletonCard />
          <SkeletonCard />
        </Grid>
      </Grid>

      <Grid container item md={6} xs={12} justifyContent="center" pl={2}>
        <Grid item xs="auto" my={2}>
          <Skeleton width="6rem" height="2rem" />
        </Grid>

        <Grid
          item
          xs={12}
          px={1}
          py={3}
          sx={{ backgroundColor: "white", borderRadius: "8px" }}
        >
          <SkeletonCard />
          <SkeletonCard />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SkeletonAppointmentsTab;
