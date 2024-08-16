import React from "react";
import { Grid } from "@mui/material";
import { Skeleton } from "primereact";
import SkeletonCard from "./SkeletonCard";

const SkeletonNotesTab = () => {
  return (
    <Grid container justifyContent="space-between" mt={2}>
      <Grid
        item
        xs={4}
        px={1}
        py={3}
        sx={{ borderRadius: 2, backgroundColor: "white" }}
      >
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Grid>

      <Grid item xs={7.8} px={3}>
        <Skeleton width="100%" height="15rem" />
      </Grid>
    </Grid>
  );
};

export default SkeletonNotesTab;
