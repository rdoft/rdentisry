import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "utils";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { ProcedureDialog } from "components/Dialog";
import ProcedureToolbar from "./ProcedureToolbar";
import DentalChart from "./DentalChart";
import ProcedureList from "./ProcedureList";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";

// services
import { PatientProcedureService } from "services";

function ProceduresTab({ patient, procedureDialog, hideDialog, getCounts }) {
  const navigate = useNavigate();

  const [procedures, setProcedures] = useState([]);
  const [selectedTooth, setSelectedTooth] = useState(null);

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    PatientProcedureService.getPatientProcedures(
      { patientId: patient.id },
      { signal }
    )
      .then((res) => {
        setProcedures(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    return () => {
      controller.abort();
    };
  }, [navigate, patient]);

  // Group procedures by tooth number
  let groupedProcedures = {};
  let tooth;
  for (let procedure of procedures) {
    tooth = procedure.toothNumber;
    if (tooth || tooth === 0) {
      if (groupedProcedures[tooth]) {
        groupedProcedures[tooth].push(procedure);
      } else {
        groupedProcedures[tooth] = [procedure];
      }
    }
  }

  // SERVICES -----------------------------------------------------------------
  // Get the list of the procedures of the patient and set procedures value
  const getProcedures = async (patientId) => {
    let response;
    let procedures;

    try {
      response = await PatientProcedureService.getPatientProcedures({
        patientId,
      });
      procedures = response.data;

      setProcedures(procedures);
      getCounts();
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
      getProcedures(patient.id);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
      getProcedures(patient.id);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

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
            procedures={groupedProcedures}
            selectedTooth={selectedTooth}
            onChangeTooth={setSelectedTooth}
          />
        </Grid>

        {/* Procedures */}
        <Grid
          item
          lg={6}
          xs={12}
          p={3}
          sx={{ borderRadius: 2, backgroundColor: "#f5f5f5" }}
        >
          {/* Toolbar */}
          <Grid item pb={2}>
            <ProcedureToolbar
              selectedTooth={selectedTooth}
              onChangeTooth={setSelectedTooth}
            />
          </Grid>

          {/* Procedure list */}
          <ProcedureList
            patient={patient}
            selectedTooth={selectedTooth}
            procedures={groupedProcedures}
            onSubmit={saveProcedure}
            onDelete={deleteProcedure}
          />
        </Grid>
      </Grid>

      {/* Dialog */}
      {procedureDialog && (
        <ProcedureDialog
          initPatientProcedure={{
            patient,
            toothNumber: selectedTooth || 0,
          }}
          onHide={hideDialog}
          onSubmit={saveProcedure}
        />
      )}
    </>
  );
}

export default ProceduresTab;
