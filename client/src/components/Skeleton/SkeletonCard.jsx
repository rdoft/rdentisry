import React from "react";
import { Grid, Divider } from "@mui/material";
import { Skeleton } from "primereact";

const SkeletonCard = () => {
  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        style={{ marginTop: "1em", marginBottom: "1em" }}
      >
        {/* Date and Time Skeleton */}
        <Grid item xs={7}>
          <Skeleton width="50%" height="2rem" className="mb-2" />
          <Skeleton width="40%" height="1.5rem" />
        </Grid>

        {/* Status Skeleton */}
        <Grid item xl={2} xs={3} textAlign="end">
          <Skeleton width="5rem" height="2rem" />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Divider style={{ margin: 0 }} />
        </Grid>
      </Grid>
    </>
  );
};

export default SkeletonCard;
