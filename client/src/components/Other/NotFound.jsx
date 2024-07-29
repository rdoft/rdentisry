import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { Goto } from "components/Button";

// assets
import svg404 from "assets/svg/404.svg";

function NotFound() {
  const navigate = useNavigate();

  // onClick handler
  const handleClick = () => {
    return navigate("/");
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <img src={svg404} alt="404" />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Goto
          onClick={handleClick}
          label="Ana sayfa git"
          severity="info"
          style={{
            color: "#FFFFFF",
            backgroundColor: "#3B5DBF",
            fontSize: "1.2rem",
          }}
        />
      </Grid>
    </Grid>
  );
}

export default NotFound;
