import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Grid, Tabs, Tab, Avatar } from "@mui/material";
import ReactToPrint from "react-to-print";
import { ProcedureDialog } from "components/Dialog";
import { NewItem, SplitItem, Print } from "components/Button";
import { AppointmentDialog } from "components/Dialog";
import ProcedureToolbar from "./ProcedureToolbar";
import DentalChart from "./DentalChart";
import ProcedureList from "./ProcedureList/ProcedureList";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";
import { ListIcon, TeethIcon } from "assets/images/icons";

// services
import {
  PatientProcedureService,
  VisitService,
  AppointmentService,
} from "services";

function ProceduresTab({
  patient,
  procedureDialog,
  appointmentDialog,
  showProcedureDialog,
  hideProcedureDialog,
  showAppointmentDialog,
  hideAppointmentDialog,
  counts,
  setCounts,
}) {
  const dt = useRef(null);

  const [tabIndex, setTabIndex] = useState(
    localStorage.getItem("activeTabIndexProcedure")
      ? parseInt(localStorage.getItem("activeTabIndexProcedure"))
      : 0
  );
  const [procedures, setProcedures] = useState([]);
  const [selectedTeeth, setSelectedTeeth] = useState([0]);
  const [selectedProcedures, setSelectedProcedures] = useState(null);
  const [visits, setVisits] = useState([]);
  const [description, setDescription] = useState("");
  const [adult, setAdult] = useState(
    patient.birthYear && new Date().getFullYear() - patient.birthYear <= 12
      ? false
      : true
  );

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
        error.message && toast.error(error.message);
      });

    VisitService.getVisits(patient.id, null, { signal })
      .then((res) => {
        setVisits(res.data);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      });

    return () => {
      controller.abort();
    };
  }, [patient]);

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
    let countProcedure = 0;

    try {
      response = await PatientProcedureService.getPatientProcedures({
        patientId,
      });
      response.data.forEach((procedure) => {
        procedure.completedDate && countProcedure++;
      });
      setProcedures(response.data);
      setCounts({
        ...counts,
        procedure: countProcedure,
      });
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // Save the procedure (update or create)
  const saveProcedures = async (procedures) => {
    try {
      // Separate procedures based on whether visit is null or not
      const withVisit = procedures.filter(
        (procedure) => procedure.visit !== null
      );
      const withoutVisit = procedures.filter(
        (procedure) => procedure.visit === null
      );

      // Create/Update the procedures with visit
      for (let procedure of withVisit) {
        procedure.id
          ? await PatientProcedureService.updatePatientProcedure({
              ...procedure,
              patient: procedure.patient,
            })
          : await PatientProcedureService.savePatientProcedure({
              ...procedure,
              patient: procedure.patient,
            });
      }
      // Create visit and create/update the procedures
      // (It will create a new visit for them and create procedures if not exist)
      if (withoutVisit.length > 0) {
        await VisitService.saveVisit(patient.id, withoutVisit);
      }

      // Get and set the updated list of procedures
      getProcedures(patient.id);
      getVisits(patient.id);
    } catch (error) {
      error.message && toast.error(error.message);
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
      error.message && toast.error(error.message);
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
      error.message && toast.error(error.message);
    }
  };

  // Save appointment (create/update)
  const saveAppointment = async (appointment) => {
    let countAppointment = 0;
    let response;

    try {
      // Save the appointment
      await AppointmentService.saveAppointment(appointment);
      hideAppointmentDialog();

      // Update the appointment counts
      response = await AppointmentService.getAppointments({
        patientId: patient.id,
      });
      response.data.forEach((appointment) => {
        appointment.status === "active" && countAppointment++;
      });
      setCounts({
        ...counts,
        appointment: countAppointment,
      });
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChangeAdult handler
  const handleToggleType = () => {
    setAdult(!adult);
    setSelectedTeeth([0]);
  };

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
    saveProcedures(updatedProcedures);
  };

  // onClick handler for creating new visit of patientProcedure
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
    saveProcedures(updatedProcedures);
  };

  // onSelect handler for creating new appointment
  const handleSelectAppointment = (visit) => {
    const description = procedures
      .filter((procedure) => procedure.visitId === visit.id)
      .map(
        (procedure) =>
          `• ${procedure.procedure.name}, [${
            procedure.toothNumber === 0 ? "Genel" : procedure.toothNumber
          }]`
      )
      .join("\n");
    setDescription(description);
    showAppointmentDialog();
  };

  // onClick handler for creating new appointment
  const handleCreateAppointment = () => {
    setDescription("");
    showAppointmentDialog();
  };

  // TEMPLATES ----------------------------------------------------------------
  // options of SplitButton for visits
  const pendingVisits = visits
    .filter((item) => !item.approvedDate)
    .map((item) => ({
      label: `📌 ${item.title}`,
      command: () => handleSelectVisit(item),
    }));

  // options of SplitButton for visits
  const approvedVisits = visits
    .filter((item) => item.approvedDate)
    .map((item) => ({
      label: `📌 ${item.title}`,
      command: () => handleSelectAppointment(item),
    }));

  return (
    <>
      <Grid
        container
        mt={2}
        justifyContent="center"
        sx={{ borderRadius: 2, backgroundColor: "white" }}
      >
        <Grid container item xl={11} xs={10} py={3} justifyContent="center">
          {tabIndex === 0 && (
            <DentalChart
              procedures={procedures}
              adult={adult}
              selectedTeeth={selectedTeeth}
              onToggleType={handleToggleType}
              onChangeTeeth={handleChangeTeeth}
            />
          )}
          {tabIndex === 1 && (
            <Grid
              container
              item
              justifyContent="space-between"
              alignItems="end"
            >
              <Grid item xs={10} pb={3}>
                <ProcedureToolbar
                  selectedTeeth={selectedTeeth}
                  onChangeTeeth={handleChangeTeeth}
                />
              </Grid>
              <Grid item alignItems="center" pb={3}>
                {procedures?.length > 0 && (
                  <ReactToPrint
                    trigger={() => <Print label="Yazdır" />}
                    content={() => dt.current}
                    pageStyle="@page { size: landscape, A4; margin: 0.4cm 0.8cm; }"
                  />
                )}
              </Grid>
              <Grid item xs={12} ref={dt}>
                <ProcedureList
                  patient={patient}
                  procedures={filteredProcedures}
                  selectedProcedures={selectedProcedures}
                  setSelectedProcedures={setSelectedProcedures}
                  selectedTeeth={selectedTeeth}
                  onChangeTeeth={handleChangeTeeth}
                  onSubmit={saveProcedures}
                  onDelete={deleteProcedure}
                  onUpdated={handleUpdated}
                />
              </Grid>
            </Grid>
          )}

          {/* Action buttons */}
          <Grid container spacing={1} justifyContent="center">
            {tabIndex === 1 && (
              <>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", justifyContent: "end" }}
                >
                  <SplitItem
                    label="Randevu Ekle"
                    options={approvedVisits}
                    onClick={handleCreateAppointment}
                    disabled={!(approvedVisits?.length > 0)}
                    tooltip={
                      !(approvedVisits?.length > 0) &&
                      "Randevu eklemek için en az bir seansı onaylayın"
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", justifyContent: "start" }}
                >
                  <SplitItem
                    label="Seans Ekle"
                    options={pendingVisits}
                    onClick={handleCreateVisit}
                    disabled={!(selectedProcedures?.length > 0)}
                    tooltip={
                      !(selectedProcedures?.length > 0) &&
                      "Seans ekleme/düzenleme yapmak için tedavi seçin"
                    }
                  />
                </Grid>
              </>
            )}
            <Grid item xs={6} md={5}>
              <NewItem label="Tedavi Ekle" onClick={showProcedureDialog} />
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

      {/* Procedure Dialog */}
      {procedureDialog && (
        <ProcedureDialog
          initPatientProcedure={{ patient }}
          visit={recentVisit && !recentVisit.approvedDate ? recentVisit : null}
          selectedTeeth={selectedTeeth}
          onChangeTeeth={handleChangeTeeth}
          onHide={hideProcedureDialog}
          onSubmit={saveProcedures}
        />
      )}

      {/* Appointment Dialog */}
      {appointmentDialog && (
        <AppointmentDialog
          initAppointment={{ description, patient }}
          onSubmit={saveAppointment}
          onHide={hideAppointmentDialog}
        />
      )}
    </>
  );
}

export default ProceduresTab;
