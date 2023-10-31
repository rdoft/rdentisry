import React, { useEffect, useState } from "react";
import { toastErrorMessage } from "components/errorMesage";
import { Grid } from "@mui/material";
import { toast } from "react-hot-toast";
import { DataScroller, Fieldset } from "primereact";
import NotFoundText from "components/NotFoundText";
import ProcedureCard from "./ProcedureCard";
import ProcedureToolbar from "./ProcedureToolbar";
import ProcedureDialog from "./ProcedureDialog";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";

// services
import { PatientService } from "services/index";

function ProceduresTab({
  patient,
  procedureDialog,
  showDialog,
  hideDialog,
  getCounts,
}) {
  const [procedures, setProcedures] = useState([]);
  const [groupedProcedures, setGroupedProcedures] = useState({});
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [procedure, setProcedure] = useState(null);

  // Set the page on loading
  useEffect(() => {
    getProcedures(patient.id, selectedTooth);
  }, [patient, selectedTooth]);

  // Set the counts when procedures change
  useEffect(() => {
    getCounts();
  }, [procedures]);

  // FUNCTIONS ----------------------------------------------------------------
  // Group procedures by tooth number
  const groupProcedures = (procedures) => {
    let groupedProcedures = {};
    let tooth;

    for (let procedure of procedures) {
      tooth = procedure.toothNumber;

      if (tooth || tooth == 0) {
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

  // Save the procedure
  const saveProcedure = async (procedure) => {
    try {
      await PatientService.savePatientProcedure(procedure.patient.id, procedure);
      toast.success("Yeni tedavi başarıyla kaydedildi");

      // Get and set the updated list of procedures
      getProcedures(patient.id, selectedTooth);
      hideDialog();
      setProcedure(null);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // TODO: Implement this function
  // Delete the procedure
  const deleteProcedure = async (procedure) => {};

  // HANDLERS -----------------------------------------------------------------
  // onHide handler
  const handleHideDialog = () => {
    setProcedure(null);
    hideDialog();
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
        legend={tooth == 0 ? `Genel` : `Diş ${tooth}`}
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
    <>
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
      {procedureDialog && (
        <ProcedureDialog
          _patientProcedure={
            procedure ? procedure : { patient, toothNumber: 0 }
          }
          onHide={handleHideDialog}
          onSubmit={saveProcedure}
          onDelete={procedure && deleteProcedure}
        />
      )}
    </>
  );
}

export default ProceduresTab;
