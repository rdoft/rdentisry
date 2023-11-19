import React, { useEffect, useState } from "react";
import { toastErrorMessage } from "components/errorMesage";
import { toast } from "react-hot-toast";
import {
  Grid,
  Typography,
  ButtonBase,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { DataScroller, Fieldset } from "primereact";
import NotFoundText from "components/NotFoundText";
import ProcedureCard from "./ProcedureCard";
import ProcedureToolbar from "./ProcedureToolbar";
import ProcedureDialog from "./ProcedureDialog";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";
import { upTeeth, downTeeth } from "assets/images/charts";

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

  const upChart = (
    <ImageList cols={16}>
      {upTeeth.map((item) => (
        <ImageListItem key={item.img}>
          <img srcSet={item.img} src={item.img} alt={item.title} />
          <Typography
            variant="body1"
            style={{ textAlign: "center", margin: 20 }}
          >
            {item.title}
          </Typography>
        </ImageListItem>
      ))}
    </ImageList>
  );

  const downChart = (
    <ImageList cols={16}>
      {downTeeth.map((item) => (
        <ButtonBase onClick={console.log("click")}>
        <ImageListItem key={item.img}>
          <Typography
            variant="body1"
            style={{ textAlign: "center", margin: 20 }}
          >
            {item.title}
          </Typography>
          <img srcSet={item.img} src={item.img} alt={item.title} />
        </ImageListItem>
        </ButtonBase>
      ))}
    </ImageList>
  );

  return (
    <>
      <Grid container justifyContent="space-between" mt={2}>
        {/* Dental chart */}
        <Grid item md={5} xs={12} pr={3}>
          {upChart}
          {downChart}
        </Grid>
        {/* Procedure list */}
        <Grid
          item
          md={7}
          xs={12}
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
          onHide={handleHide}
          onSubmit={saveProcedure}
        />
      )}
    </>
  );
}

export default ProceduresTab;
