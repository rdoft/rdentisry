import React, { useState, useEffect, useCallback } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import List from "@mui/material/List";

import Patient from "./Patient";
import PatientService from "services/Patient.service";

// import classes from "assets/styles/PatientList.module.css";

function PatientList() {
  // Set the default values
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the list of patients and set patients value
  const getPatientsHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    let response;
    let patients;

    try {
      response = await PatientService.getAll();
      patients = response.data.map((patient) => {
        return {
          id: patient.PatientId,
          name: patient.Name,
          surname: patient.Surname,
          phone: patient.Phone,
        };
      });

      setPatients(patients);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, []);

  // Set the page on loading
  useEffect(() => {
    getPatientsHandler();
  }, [getPatientsHandler]);

  // Get the content of the Patients list
  // and control the loading/error state
  function getContent() {
    let content = <Alert severity="info">Hiç kayıt yok</Alert>;
    if (patients.length > 0) {
      // <ul className={classes["patient-list"]}>
      content = (
        <List className="patient-list">
          {patients.map((patient) => (
            <Patient
              name={patient.name}
              surname={patient.surname}
              phone={patient.phone}
            />
          ))}
        </List>
      );
    }
    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    }
    if (loading) {
      content = <CircularProgress />;
    }
    return content;
  }

  return (
    <Card>
      <CardActions>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<FactCheckRoundedIcon />}
          onClick={getPatientsHandler}
        >
          Hastaları listele
        </Button>
      </CardActions>
      <CardContent>{getContent()}</CardContent>
    </Card>
  );
}

export default PatientList;
