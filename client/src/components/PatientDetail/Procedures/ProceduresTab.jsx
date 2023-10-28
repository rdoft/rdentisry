import React, { useEffect, useState } from "react";
import { toastErrorMessage } from "components/errorMesage";
import { Grid } from "@mui/material";
import { toast } from "react-hot-toast";
import { DataScroller } from "primereact";
import NotFoundText from "components/NotFoundText";
import ProcedureCard from "./ProcedureCard";

// services
import { PatientService } from "services/index";
import ProcedureToolbar from "./ProcedureToolbar";

function ProceduresTab({ patient }) {
  const [procedures, setProcedures] = useState([]);
  const [selectedTooth, setSelectedTooth] = useState(null);

  useEffect(() => {
    getProcedures(patient.id);
  }, [patient]);

  useEffect(() => {
    selectedTooth
      ? getToothProcedures(patient.id, selectedTooth)
      : getProcedures(patient.id);
  }, [selectedTooth]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of the procedures of the patient and set procedures value
  const getProcedures = async (patientId) => {
    let response;
    let procedures;

    try {
      response = await PatientService.getPatientProcedures(patientId);
      procedures = response.data;

      setProcedures(procedures);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // Get the list of the proceures of the selected tooth of patient
  const getToothProcedures = async (patientId, tooth) => {
    let response;
    let procedures;

    try {
      response = await PatientService.getPatientProcedures(patientId, tooth);
      procedures = response.data;

      setProcedures(procedures);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // TEMPLATES ----------------------------------------------------------------
  const procedureTemplate = (procedure) => {
    if (procedure) {
      return <ProcedureCard procedure={procedure} />;
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // const handleSelectTooth = (tooth) => {
  //   setSelectedTooth(tooth);
  // };

  return (
    <Grid container justifyContent="space-between" mt={2}>
      {/* Dental chart */}
      <Grid item xs={5} pr={3}></Grid>
      {/* Procedure list */}
      <Grid
        item
        xs={7}
        p={4}
        sx={{ borderRadius: 2, backgroundColor: "#f5f5f5" }}
      >
        <Grid item pb={2}>
          <ProcedureToolbar
            selectedTooth={selectedTooth}
            onChangeTooth={setSelectedTooth}
          />
        </Grid>
        <Grid item>
          <DataScroller
            value={procedures}
            itemTemplate={procedureTemplate}
            rows={10}
            emptyMessage={<NotFoundText text={"İşlem bulunamadı"} p={0} />}
          ></DataScroller>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProceduresTab;
