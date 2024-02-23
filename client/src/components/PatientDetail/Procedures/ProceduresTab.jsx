import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "utils";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller, Fieldset } from "primereact";
import NotFoundText from "components/NotFoundText";
import ProcedureCard from "./ProcedureCard";
import ProcedureToolbar from "./ProcedureToolbar";
import { ProcedureDialog } from "components/Dialog";
import DentalChart from "./DentalChart";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";

// services
import { PatientProcedureService } from "services";

function ProceduresTab({ patient, procedureDialog, hideDialog, getCounts }) {
  const navigate = useNavigate();

  const [procedures, setProcedures] = useState([]);
  const [procedure, setProcedure] = useState(null);
  const [selectedTooth, setSelectedTooth] = useState(null);

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    PatientProcedureService.getPatientProcedures(
      { patientId: patient.id, tooth: selectedTooth },
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
  }, [navigate, patient, selectedTooth]);

  // Group procedures by tooth number
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

  // SERVICES -----------------------------------------------------------------
  // Get the list of the procedures of the patient and set procedures value
  const getProcedures = async (patientId, tooth) => {
    let response;
    let procedures;

    try {
      response = await PatientProcedureService.getPatientProcedures({
        patientId,
        tooth,
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
      getProcedures(patient.id, selectedTooth);
      setProcedure(null);
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
      getProcedures(patient.id, selectedTooth);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
            procedures={groupedProcedures}
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

      {/* Dialog */}
      {procedureDialog && (
        <ProcedureDialog
          initPatientProcedure={
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
