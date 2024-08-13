import React from "react";
import { Grid } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

const LoadingIcon = (props) => {
  const theme = useTheme();

  return (
    <Grid container justifyContent="center" sx={{ ...props?.style }}>
      <i
        className="pi pi-spin pi-spinner"
        style={{ color: theme.palette.text.secondary }}
      />
    </Grid>
  );
};

export default LoadingIcon;
