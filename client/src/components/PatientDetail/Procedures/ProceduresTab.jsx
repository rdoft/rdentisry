import React, { useEffect, useState } from "react";
import { toastErrorMessage } from "components/errorMesage";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller, Fieldset } from "primereact";
import NotFoundText from "components/NotFoundText";
import ProcedureCard from "./ProcedureCard";
import ProcedureToolbar from "./ProcedureToolbar";
import ProcedureDialog from "./ProcedureDialog";
import DentalChart from "./DentalChart";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";

// services
import { PatientProcedureService } from "services/index";

function ProceduresTab({ patient, procedureDialog, hideDialog, getCounts }) {
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
        response = await PatientProcedureService.getPatientProcedures(
          patientId,
          tooth
        );
        procedures = response.data;
      } else {
        response = await PatientProcedureService.getPatientProcedures(
          patientId
        );
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
      // Update
      if (procedure.id) {
        await PatientProcedureService.updatePatientProcedure(procedure);
      } else {
        // Create
        await PatientProcedureService.savePatientProcedure(procedure);
      }

      // Get and set the updated list of procedures
      getProcedures(patient.id, selectedTooth);
      hideDialog();
      setProcedure(null);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // Delete the procedure
  const deleteProcedure = async (procedure) => {
    try {
      await PatientProcedureService.deletePatientProcedure(
        patient.id,
        procedure.id
      );

      // Get and set the updated list of procedures
      getProcedures(patient.id, selectedTooth);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onHide handler
  const handleHide = () => {
    setProcedure(null);
    hideDialog();
  };

  // TEMPLATES ----------------------------------------------------------------
  const procedureTemplate = (procedure) => {
    if (procedure) {
      return (
        <ProcedureCard
          procedure={{ ...procedure, patient }}
          onDelete={deleteProcedure}
          onSubmit={saveProcedure}
        />
      );
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
      <Grid
        container
        justifyContent="space-between"
        mt={2}
        p={3}
        sx={{ borderRadius: 2, backgroundColor: "#FFFFFF" }}
      >
        {/* Dental chart */}
        <Grid
          container
          item
          lg={6}
          xs={12}
          pr={{ lg: 3 }}
          pb={{ xs: 3, lg: 0 }}
        >
          <DentalChart
            selectedTooth={selectedTooth}
            onChangeTooth={setSelectedTooth}
          />
        </Grid>

        {/* Procedure list */}
        <Grid
          item
          lg={6}
          xs={12}
          p={3}
          sx={{ borderRadius: 2, backgroundColor: "#f5f5f5"}}
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

      {/* Dialog */}
      {procedureDialog && (
        <ProcedureDialog
          _patientProcedure={
            procedure ? procedure : { patient, toothNumber: selectedTooth || 0 }
          }
          onHide={handleHide}
          onSubmit={saveProcedure}
        />
      )}
    </>
  );
}

export default ProceduresTab;
