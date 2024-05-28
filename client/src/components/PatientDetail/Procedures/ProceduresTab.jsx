import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "utils";
import { toast } from "react-hot-toast";
import { Grid, Tabs, Tab, Avatar } from "@mui/material";
import { ProcedureDialog } from "components/Dialog";
import { NewItem } from "components/Button";
import NotFoundText from "components/NotFoundText";
import ProcedureToolbar from "./ProcedureToolbar";
import DentalChart from "./DentalChart";
import ProcedureList from "./ProcedureList/ProcedureList";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";
// assets
import { ListIcon, TeethIcon } from "assets/images/icons";

// services
import { PatientProcedureService, InvoiceService } from "services";

function ProceduresTab({
  patient,
  procedureDialog,
  showDialog,
  hideDialog,
  counts,
  setCounts,
}) {
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [procedures, setProcedures] = useState([]);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [selectedProcedures, setSelectedProcedures] = useState(null);

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

  // Save the procedure (update or create)
  const saveProcedure = async (procedure) => {
    try {
      if (Array.isArray(procedure)) {
        for (let p of procedure) {
          p.id
            ? await PatientProcedureService.updatePatientProcedure(p)
            : await PatientProcedureService.savePatientProcedure(p);
        }
      } else {
        procedure.id
          ? await PatientProcedureService.updatePatientProcedure(procedure)
          : await PatientProcedureService.savePatientProcedure(procedure);
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

  // Create the default invoice for the patient procedures
  const createInvoice = async (procedures) => {
    try {
      await InvoiceService.saveInvoice(patient.id, procedures);

      // Get and set the updated list of procedures
      getProcedures(patient.id);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange handler for the tabs
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // onClick handler for add invoice
  const handleClickInvoice = () => {
    const updatedProcedures = [];
    for (let procedure of selectedProcedures) {
      for (let i = 0; i < procedure.ids.length; i++) {
        const found = procedures.find((item) => item.id === procedure.ids[i]);
        updatedProcedures.push({
          ...found,
          invoice: null,
          patient: patient,
        });
      }
    }

    setSelectedProcedures(null);
    createInvoice(updatedProcedures);
  };

  return (
    <>
      <Grid
        container
        mt={2}
        pb={3}
        justifyContent="center"
        sx={{ borderRadius: 2, backgroundColor: "#FFFFFF" }}
      >
        <Grid container item xl={11} xs={10} py={3} justifyContent="center">
          {tabIndex === 0 && (
            <DentalChart
              procedures={groupedProcedures}
              selectedTooth={selectedTooth}
              onChangeTooth={setSelectedTooth}
            />
          )}
          {tabIndex === 1 &&
            (procedures.length === 0 ? (
              <NotFoundText text="Tedavi yok" />
            ) : (
              <Grid container item>
                <Grid item xs={12} pb={3}>
                  <ProcedureToolbar
                    selectedTooth={selectedTooth}
                    onChangeTooth={setSelectedTooth}
                  />
                </Grid>
                <Grid item xs>
                  <ProcedureList
                    patient={patient}
                    procedures={procedures}
                    selectedTooth={selectedTooth}
                    selectedProcedures={selectedProcedures}
                    setSelectedProcedures={setSelectedProcedures}
                    onSubmit={saveProcedure}
                    onDelete={deleteProcedure}
                    onUpdate={getProcedures}
                  />
                </Grid>
              </Grid>
            ))}
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

      <Grid container justifyContent="center" mt={3}>
        {/* Add Invoice */}
        {selectedProcedures?.length > 0 && (
          <Grid item xs={6} md={4}>
            <NewItem label="Plan Oluştur" onClick={handleClickInvoice} />
          </Grid>
        )}
        {/* Add Procedure */}
        <Grid item xs={6} md={4}>
          <NewItem label="Tedavi Ekle" onClick={showDialog} />
        </Grid>
      </Grid>

      {/* Dialog */}
      {procedureDialog && (
        <ProcedureDialog
          initPatientProcedure={{
            patient,
            toothNumber: selectedTooth || 0,
            invoice: procedures.sort(
              (a, b) => new Date(b?.invoice.id) - new Date(a?.invoice.id)
            )[0]?.invoice,
          }}
          onHide={hideDialog}
          onSubmit={saveProcedure}
        />
      )}
    </>
  );
}

export default ProceduresTab;
