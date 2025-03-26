import React from "react";
import { Grid, Typography } from "@mui/material";

const Box = ({ title, price, feature, ...props }) => {
  return (
    <Grid
      container
      p={4}
      justifyContent="center"
      textAlign="center"
      sx={{
        ...props.style,
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>
      <Grid item xs={12} mt={3}>
        <Typography variant="h1" fontWeight="900">
          {price}
        </Typography>
      </Grid>
      <Grid item xs={12} mt={4}>
        {feature.map((item) => (
          <Typography key={item} variant="h5" fontWeight="light">
            {item}
          </Typography>
        ))}
      </Grid>
    </Grid>
  );
};

export default Box;
