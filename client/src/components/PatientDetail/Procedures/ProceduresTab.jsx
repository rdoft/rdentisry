import React, { useEffect, useState } from "react";
import { toastErrorMessage } from "components/errorMesage";
import { Grid } from "@mui/material";
import { toast } from "react-hot-toast";
import { DataScroller, Fieldset } from "primereact";
import NotFoundText from "components/NotFoundText";
import ProcedureCard from "./ProcedureCard";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";

// services
import { PatientService } from "services/index";
import ProcedureToolbar from "./ProcedureToolbar";

function ProceduresTab({ patient }) {
  const [procedures, setProcedures] = useState([]);
  const [groupedProcedures, setGroupedProcedures] = useState({});
  const [selectedTooth, setSelectedTooth] = useState(null);

  useEffect(() => {
    getProcedures(patient.id, selectedTooth);
  }, [patient, selectedTooth]);

  // FUNCTIONS ----------------------------------------------------------------
  // Group procedures by tooth number
  const groupProcedures = (procedures) => {
    let groupedProcedures = {};
    let tooth;

    for (let procedure of procedures) {
      tooth = procedure.toothNumber;

      if (tooth) {
        if (groupedProcedures[tooth]) {
          groupedProcedures[tooth].push(procedure);
        } else {
          groupedProcedures[tooth] = [procedure];
        }
      }
    }

    setGroupedProcedures(groupedProcedures);
  };

  // SERVICES -----------------------------------------------------------------
  // Get the list of the procedures of the patient and set procedures value
  const getProcedures = async (patientId, tooth) => {
    let response;
    let procedures;

    try {
      if (tooth) {
        response = await PatientService.getPatientProcedures(patientId, tooth);
        procedures = response.data;
      } else {
        response = await PatientService.getPatientProcedures(patientId);
        procedures = response.data;
        groupProcedures(procedures);
      }

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

  // Template the procedures list of the selected tooth or all teeth
  const proceduresTemplate = selectedTooth ? (
    <DataScroller
      value={procedures}
      itemTemplate={procedureTemplate}
      rows={10}
    ></DataScroller>
  ) : (
    Object.entries(groupedProcedures).map(([tooth, items]) => (
      <Fieldset
        key={tooth}
        className="mb-2"
        legend={`Diş ${tooth}`}
        toggleable
        style={{ fontSize: "smaller" }}
      >
        <DataScroller
          value={items}
          itemTemplate={procedureTemplate}
          rows={10}
        ></DataScroller>
      </Fieldset>
    ))
  );

  return (
    <Grid container justifyContent="space-between" mt={2}>
      {/* Dental chart */}
      <Grid item xs={5} pr={3}></Grid>
      {/* Procedure list */}
      <Grid
        item
        xs={7}
        p={2}
        sx={{ borderRadius: 2, backgroundColor: "#f5f5f5" }}
      >
        <Grid item pb={2}>
          <ProcedureToolbar
            selectedTooth={selectedTooth}
            onChangeTooth={setSelectedTooth}
          />
        </Grid>
        {procedures.length === 0 ? (
          <NotFoundText text={"Tedavi yok"} p={3} />
        ) : (
          <Grid item>{proceduresTemplate}</Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ProceduresTab;
