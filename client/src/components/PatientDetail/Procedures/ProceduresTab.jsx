import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "utils";
import { toast } from "react-hot-toast";
import { Grid, Tabs, Tab, Avatar } from "@mui/material";
import { ProcedureDialog } from "components/Dialog";
import { NewItem, SplitItem } from "components/Button";
import ProcedureToolbar from "./ProcedureToolbar";
import DentalChart from "./DentalChart";
import ProcedureList from "./ProcedureList/ProcedureList";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";
import { ListIcon, TeethIcon } from "assets/images/icons";

// services
import { PatientProcedureService, VisitService } from "services";

function ProceduresTab({
  patient,
  procedureDialog,
  showDialog,
  hideDialog,
  counts,
  setCounts,
}) {
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(
    localStorage.getItem("activeTabIndexProcedure")
      ? parseInt(localStorage.getItem("activeTabIndexProcedure"))
      : 0
  );
  const [procedures, setProcedures] = useState([]);
  const [selectedTeeth, setSelectedTeeth] = useState([0]);
  const [selectedProcedures, setSelectedProcedures] = useState(null);
  const [visits, setVisits] = useState([]);

  // Add keydown event listener
  // when component mounts and remove it when unmounts
  useEffect(() => {
    // onKeyDown handler to cancel selected tooth
    const handleKeyDown = (event) => {
      // If an input element is focused, do not execute the rest of the handler
      if (document.activeElement.tagName.toLowerCase() === "input") {
        return;
      }

      event.key === "Escape" && setSelectedTeeth([0]);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSelectedTeeth]);

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

    VisitService.getVisits(patient.id, true, { signal })
      .then((res) => {
        setVisits(res.data);
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

  // Filter procedures based on selectedTeeth
  const filteredProcedures = procedures.filter(
    (procedure) =>
      selectedTeeth.includes(0) || selectedTeeth.includes(procedure.toothNumber)
  );
  // Get the recent visit of the patient
  const recentVisit = procedures.sort(
    (a, b) => new Date(b?.visit.id) - new Date(a?.visit.id)
  )[0]?.visit;

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

  // Save the procedure (update or create)
  const saveProcedure = async (procedure) => {
    try {
      if (Array.isArray(procedure)) {
        for (let p of procedure) {
          p.id
            ? await PatientProcedureService.updatePatientProcedure({
                ...p,
                patient: patient,
              })
            : await PatientProcedureService.savePatientProcedure({
                ...p,
                patient: patient,
              });
        }
      } else {
        procedure.id
          ? await PatientProcedureService.updatePatientProcedure({
              ...procedure,
              patient,
            })
          : await PatientProcedureService.savePatientProcedure({
              ...procedure,
              patient,
            });
      }

      // Get and set the updated list of procedures
      getProcedures(patient.id);
      getVisits(patient.id);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Delete the procedure and filter selected procedures
  const deleteProcedure = async (procedure) => {
    let _selectedProcedures;

    try {
      if (Array.isArray(procedure)) {
        for (let p of procedure) {
          await PatientProcedureService.deletePatientProcedure(
            patient.id,
            p.id
          );
        }
        _selectedProcedures = selectedProcedures
          ? selectedProcedures.filter(
              (item) => !procedure.find((p) => p.id === item.id)
            )
          : null;
      } else {
        await PatientProcedureService.deletePatientProcedure(
          patient.id,
          procedure.id
        );
        _selectedProcedures = selectedProcedures
          ? selectedProcedures.filter((item) => item.id !== procedure.id)
          : null;
      }

      setSelectedProcedures(_selectedProcedures);
      getProcedures(patient.id);
      getVisits(patient.id);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Create the default visit for the patient procedures
  const createVisit = async (procedures) => {
    try {
      await VisitService.saveVisit(patient.id, procedures);

      // Get and set the updated list of procedures
      getProcedures(patient.id);
      getVisits(patient.id);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Get visits for a given patientId
  const getVisits = async (patientId) => {
    let response;
    let visits;

    try {
      response = await VisitService.getVisits(patientId);
      visits = response.data;

      setVisits(visits);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onSelectTooth handler
  const handleChangeTeeth = (teeth) => {
    teeth = teeth?.filter((tooth) => tooth !== 0);

    if (teeth && teeth.length > 0) {
      setSelectedTeeth(teeth);
    } else {
      setSelectedTeeth([0]);
    }
  };

  // onUpdated handler
  const handleUpdated = (patientId) => {
    getProcedures(patientId);
    getVisits(patientId);
  };

  // onChange handler for the tabs
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    localStorage.setItem("activeTabIndexProcedure", newValue);
  };

  // onSelect handler for the visit of patientProcedure
  const handleSelectVisit = (visit) => {
    const updatedProcedures = [];
    for (let procedure of selectedProcedures) {
      for (let i = 0; i < procedure.ids.length; i++) {
        const found = procedures.find((item) => item.id === procedure.ids[i]);
        updatedProcedures.push({
          ...found,
          visit: visit,
          patient: patient,
        });
      }
    }

    setSelectedProcedures(null);
    saveProcedure(updatedProcedures);
  };

  // onSelect handler for creating new visit of patientProcedure
  const handleCreateVisit = () => {
    const updatedProcedures = [];
    for (let procedure of selectedProcedures) {
      for (let i = 0; i < procedure.ids.length; i++) {
        const found = procedures.find((item) => item.id === procedure.ids[i]);
        updatedProcedures.push({
          ...found,
          visit: null,
          patient: patient,
        });
      }
    }

    setSelectedProcedures(null);
    createVisit(updatedProcedures);
  };

  return (
    <>
      <Grid
        container
        mt={2}
        justifyContent="center"
        sx={{ borderRadius: 2, backgroundColor: "#FFFFFF" }}
      >
        <Grid container item xl={11} xs={10} py={3} justifyContent="center">
          {tabIndex === 0 && (
            <DentalChart
              procedures={procedures}
              selectedTeeth={selectedTeeth}
              onChangeTeeth={handleChangeTeeth}
            />
          )}
          {tabIndex === 1 && (
            <Grid container item>
              <Grid item xs={12} pb={3}>
                <ProcedureToolbar
                  selectedTeeth={selectedTeeth}
                  onChangeTeeth={handleChangeTeeth}
                />
              </Grid>
              <Grid item xs>
                <ProcedureList
                  patient={patient}
                  procedures={filteredProcedures}
                  selectedProcedures={selectedProcedures}
                  setSelectedProcedures={setSelectedProcedures}
                  onSubmit={saveProcedure}
                  onDelete={deleteProcedure}
                  onUpdated={handleUpdated}
                />
              </Grid>
            </Grid>
          )}

          {/* Action buttons */}
          <Grid container justifyContent="center">
            {selectedProcedures?.length > 0 && (
              <Grid item xs={6} md={5}>
                <SplitItem
                  label="Tedavi Planı Ekle"
                  options={visits}
                  onClick={handleCreateVisit}
                  onSelect={handleSelectVisit}
                />
              </Grid>
            )}
            <Grid item xs={6} md={5}>
              <NewItem label="Tedavi Ekle" onClick={showDialog} />
            </Grid>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Grid item xs="auto" py={3}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            orientation="vertical"
          >
            <Tab value={0} icon={<Avatar src={TeethIcon} />} disableRipple />
            <Tab value={1} icon={<Avatar src={ListIcon} />} disableRipple />
          </Tabs>
        </Grid>
      </Grid>

      {/* Dialog */}
      {procedureDialog && (
        <ProcedureDialog
          initPatientProcedure={{
            patient,
            visit:
              recentVisit && !recentVisit.approvedDate ? recentVisit : null,
          }}
          selectedTeeth={selectedTeeth}
          onChangeTeeth={handleChangeTeeth}
          onHide={hideDialog}
          onSubmit={saveProcedure}
        />
      )}
    </>
  );
}

export default ProceduresTab;
