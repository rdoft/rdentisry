import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "utils";
import { toast } from "react-hot-toast";
import { Grid, Tabs, Tab, Avatar } from "@mui/material";
import { ProcedureDialog } from "components/Dialog";
import { NewItem } from "components/Button";
import ProcedureToolbar from "./ProcedureToolbar";
import DentalChart from "./DentalChart";
import ProcedureList from "./ProcedureList/ProcedureList";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";
// assets
import { ListIcon, TeethIcon } from "assets/images/icons";

// services
import { PatientProcedureService } from "services";

function ProceduresTab({
  patient,
  procedureDialog,
  showDialog,
  hideDialog,
  counts,
  setCounts,
}) {
  const navigate = useNavigate();
  
  const [procedures, setProcedures] = useState([]);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

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
      setCounts({
        ...counts,
        procedure: procedures.length,
      });
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

  // HANDLERS -----------------------------------------------------------------
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // TODO: Fix the issue about tabIndex
  return (
    <>
      <Grid
        container
        mt={2}
        pb={3}
        justifyContent="center"
        spacing={2}
        sx={{ borderRadius: 2, backgroundColor: "#FFFFFF" }}
      >
        <Grid container item lg={10} md={10} xs={10}>
          {tabIndex === 0 && (
            <DentalChart
              procedures={groupedProcedures}
              selectedTooth={selectedTooth}
              onChangeTooth={setSelectedTooth}
            />
          )}
          {tabIndex === 1 && (
            <Grid container item>
              <Grid item xs pb={3}>
                <ProcedureToolbar
                  selectedTooth={selectedTooth}
                  onChangeTooth={setSelectedTooth}
                />
              </Grid>
              <ProcedureList
                patient={patient}
                selectedTooth={selectedTooth}
                procedures={procedures}
                onSubmit={saveProcedure}
                onDelete={deleteProcedure}
              />
              <NewItem label="Tedavi Ekle" onClick={showDialog} />
            </Grid>
          )}
        </Grid>
        <Grid item lg={1} md={1} xs={1}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            orientation="vertical"
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            {tabIndex !== 0 && (
              <Tab value={0} icon={<Avatar src={TeethIcon} />} />
            )}
            {tabIndex !== 1 && (
              <Tab value={1} icon={<Avatar src={ListIcon} />} />
            )}
          </Tabs>
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
