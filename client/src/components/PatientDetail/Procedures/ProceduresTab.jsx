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
    getProcedures(patient.id);
  }, [patient]);

  useEffect(() => {
    selectedTooth
      ? getToothProcedures(patient.id, selectedTooth)
      : getProcedures(patient.id);
  }, [selectedTooth]);

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
  const getProcedures = async (patientId) => {
    let response;
    let procedures;

    try {
      response = await PatientService.getPatientProcedures(patientId);
      procedures = response.data;

      groupProcedures(procedures);
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

  // Template the list of the procedures of the selected tooth of patient
  const fieldset = Object.entries(groupedProcedures).map(
    ([tooth, items]) => (
      <Fieldset
        key={tooth}
        className="mb-2"
        legend={`Diş ${tooth}`}
        toggleable
        toggleIcon={{
          expanded: <i className="pi pi-eye"></i>,
          collapsed: <i className="pi pi-eye-slash"></i>,
        }}
        style={{ fontSize: "smaller" }}
      >
        <DataScroller
          value={items}
          itemTemplate={procedureTemplate}
          rows={10}
        ></DataScroller>
      </Fieldset>
    )
  );

  // HANDLERS -----------------------------------------------------------------
  // const handleSelectTooth = (tooth) => {
  //   setSelectedTooth(tooth);
  // };

  return (
    <Grid container justifyContent="space-between" mt={2}>
      {/* Dental chart */}
      <Grid item xs={5} pr={3}></Grid>
      {/* Procedure list */}
      {procedures.length === 0 ? (
        <Grid item xs={7}>
          <NotFoundText text={"İşlem yok"} p={3} />
        </Grid>
      ) : (
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
          <Grid item>{fieldset}</Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProceduresTab;
