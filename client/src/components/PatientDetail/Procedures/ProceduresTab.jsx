import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "utils";
import { toast } from "react-hot-toast";
import { SplitButton } from "primereact";
import { Grid, Tabs, Tab, Avatar } from "@mui/material";
import { ProcedureDialog } from "components/Dialog";
import { NewItem } from "components/Button";
import NotFoundText from "components/NotFoundText";
import ProcedureToolbar from "./ProcedureToolbar";
import DentalChart from "./DentalChart";
import ProcedureList from "./ProcedureList/ProcedureList";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";
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
  const [selectedTeeth, setSelectedTeeth] = useState([0]);
  const [selectedProcedures, setSelectedProcedures] = useState(null);
  const [invoices, setInvoices] = useState([]);

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

    InvoiceService.getInvoices({ patientId: patient.id }, { signal })
      .then((res) => {
        setInvoices(res.data);
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
      getInvoices(patient.id);
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
      getInvoices(patient.id);
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
      getInvoices(patient.id);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Get invoices for a given patientId
  const getInvoices = async (patientId) => {
    let response;
    let invoices;

    try {
      response = await InvoiceService.getInvoices({ patientId });
      invoices = response.data;

      setInvoices(invoices);
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
    getInvoices(patientId);
  };

  // onChange handler for the tabs
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // onSelect handler for the invoice of patientProcedure
  const handleSelectInvoice = (invoice) => {
    const updatedProcedures = [];
    for (let procedure of selectedProcedures) {
      for (let i = 0; i < procedure.ids.length; i++) {
        const found = procedures.find((item) => item.id === procedure.ids[i]);
        updatedProcedures.push({
          ...found,
          invoice: invoice,
          patient: patient,
        });
      }
    }

    setSelectedProcedures(null);
    saveProcedure(updatedProcedures);
  };

  // onSelect handler for creating new invoice of patientProcedure
  const handleCreateInvoice = () => {
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

  const invoiceOptions = invoices.map((invoice) => ({
    label: `📌 ${invoice.title}`,
    command: () => handleSelectInvoice(invoice),
  }));

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
              selectedTeeth={selectedTeeth}
              onChangeTeeth={handleChangeTeeth}
            />
          )}
          {tabIndex === 1 &&
            (procedures.length === 0 ? (
              <NotFoundText text="Tedavi yok" />
            ) : (
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
                    procedures={procedures}
                    selectedTooth={selectedTeeth}
                    selectedProcedures={selectedProcedures}
                    setSelectedProcedures={setSelectedProcedures}
                    onSubmit={saveProcedure}
                    onDelete={deleteProcedure}
                    onUpdated={handleUpdated}
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
        {/* Select Invoice */}
        {selectedProcedures?.length > 0 && (
          <Grid item xs={6} md={4} mt={2} style={{ textAlign: "center" }}>
            <SplitButton
              text
              outlined
              size="small"
              icon="pi pi-plus"
              label="Plan Oluştur"
              menuStyle={{ borderRadius: "0.5rem", color: "#182A4D" }}
              model={invoiceOptions}
              onClick={handleCreateInvoice}
            />
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
            invoice: procedures.sort(
              (a, b) => new Date(b?.invoice.id) - new Date(a?.invoice.id)
            )[0]?.invoice,
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
