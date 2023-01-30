import React from "react";
import { ListItem } from "@mui/material/index";

// import classes from "assets/styles/Patient.module.css";

function Patient(props) {
  return (
    // <li className={classes.patient}>
    <ListItem className="patient">
      <h3>{props.name}</h3>
      <h3>{props.surname}</h3>
      <p>{props.phone}</p>
    </ListItem>
  );
}

export default Patient;
