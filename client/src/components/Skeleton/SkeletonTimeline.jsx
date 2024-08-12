import React from "react";
import { Grid } from "@mui/material";
import { Skeleton } from "primereact";

const SkeletonTimeline = () => {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Grid
          container
          key={index}
          alignItems="center"
          justifyContent="center"
          mt={2}
          mb={3}
        >
          <Grid item xs={2}>
            <Skeleton width="100%" height="2rem" />
          </Grid>
          <Grid item m={2}>
            <Skeleton shape="circle" size="2.5rem" />
          </Grid>
          <Grid item xs={2}>
            <Skeleton width="100%" height="2rem" />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonTimeline;
