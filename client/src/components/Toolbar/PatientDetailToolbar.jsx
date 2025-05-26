import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Menu, Toolbar, ConfirmDialog } from "primereact";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { PatientDialog, PatientPermissionDialog } from "components/Dialog";
import { DialogFooter } from "components/DialogFooter";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { PatientCard } from "components/Cards";
import { More, Delete, Basic } from "components/Button";
import PatientDetailToolbarAction from "./PatientDetailToolbarAction";

// assets
import { useTheme } from "@mui/material/styles";
import "assets/styles/Toolbar/PatientDetailToolbar.css";

// services
import { PatientService } from "services";

function PatientDetailToolbar({
  patient,
  setPatient,
  activeIndex,
  onTabChange,
  showAppointmentDialog,
  showPaymentDialog,
  showNoteDialog,
  showProcedureDialog,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { refresh } = useSubscription();
  const menu = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Set the default values
  const [patientDialog, setPatientDialog] = useState(false);
  const [permissionDialog, setPermissionDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Save patient (update)
  const savePatient = async (patient) => {
    try {
      startLoading("save");
      await PatientService.updatePatient(patient);
      setPatient(patient);
      setPatientDialog(false);
      refresh();
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // Delete patient
  const deletePatient = async () => {
    try {
      startLoading("delete");
      await PatientService.deletePatient(patient.id);
      refresh();
      navigate("/patients");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
    }
  };

  // Show patient dialog
  const showPatientDialog = () => {
    setPatientDialog(true);
  };

  // Hide patient dialog
  const hidePatientDialog = () => {
    setPatientDialog(false);
  };

  // Show permission dialog
  const showPermissionDialog = () => {
    setPermissionDialog(true);
  };

  // Hide permission dialog
  const hidePermissionDialog = () => {
    setPermissionDialog(false);
  };

  // Save permission
  const handleSavePermission = (permission) => {
    setPermissionDialog(false);
    savePatient({
      ...patient,
      isSMS: permission.isSMS,
    });
  };

  // Show delete dialog
  const showDeleteDialog = () => {
    setDeleteDialog(true);
  };

  // Hide delete dialog
  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  // TEMPLATES ----------------------------------------------------------------
  const menuItems = [
    {
      template: () => (
        <Basic
          label="Görüntüle / Düzenle"
          icon="pi pi-external-link"
          onClick={(event) => {
            menu.current.toggle(event);
            showPatientDialog();
          }}
        />
      ),
    },
    {
      template: () => (
        <Basic
          label="İzinleri Yönet"
          icon="pi pi-key"
          onClick={(event) => {
            menu.current.toggle(event);
            showPermissionDialog();
          }}
        />
      ),
    },
    {
      template: () => (
        <Basic
          label="Randevu Ekle"
          icon="pi pi-calendar-plus"
          onClick={(event) => {
            menu.current.toggle(event);
            showAppointmentDialog(true);
          }}
        />
      ),
    },
    {
      template: () => (
        <Basic
          label="Ödeme Ekle"
          icon="pi pi-money-bill"
          onClick={(event) => {
            menu.current.toggle(event);
            showPaymentDialog("payment", true);
          }}
        />
      ),
    },
    {
      template: () => (
        <Basic
          label="Not Ekle"
          icon="pi pi-file-edit"
          onClick={(event) => {
            menu.current.toggle(event);
            showNoteDialog(true);
          }}
        />
      ),
    },
    {
      template: () => (
        <Basic
          label="Tedavi Ekle"
          icon="pi pi-plus-circle"
          onClick={(event) => {
            menu.current.toggle(event);
            showProcedureDialog(true);
          }}
        />
      ),
    },
    {
      template: () => (
        <Delete
          label="Sil"
          style={{ width: "100%", textAlign: "start" }}
          onClick={(event) => {
            menu.current.toggle(event);
            showDeleteDialog(true);
          }}
        />
      ),
    },
  ];

  const startContent = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexGrow: isMobile ? 1 : 0,
        borderRadius: "0.5rem",
        border: `1px solid ${theme.palette.divider}`,
        padding: "0 0.25rem",
        width: isMobile ? "100%" : "auto",
        justifyContent: isMobile ? "space-between" : "flex-start",
      }}
    >
      <PatientCard patient={patient} />
      <More
        variant="text"
        severity="primary"
        size="small"
        onClick={(event) => menu.current.toggle(event)}
      />
      <Menu
        model={menuItems}
        ref={menu}
        id="popup_menu"
        popup
        style={{
          padding: "0.25rem",
        }}
      />
    </Box>
  );

  const endContent = () => {
    return (
      !isMobile && (
        <PatientDetailToolbarAction
          activeIndex={activeIndex}
          onTabChange={onTabChange}
          showAppointmentDialog={showAppointmentDialog}
          showPaymentDialog={showPaymentDialog}
          showNoteDialog={showNoteDialog}
          showProcedureDialog={showProcedureDialog}
        />
      )
    );
  };

  // Delete patient dialog template
  const deletePatientDialog = (
    <ConfirmDialog
      visible={deleteDialog}
      onHide={hideDeleteDialog}
      message=<Typography variant="body1">
        <strong>
          {patient?.name} {patient?.surname}
        </strong>{" "}
        isimli hastayı silmek istediğinizden emin misiniz?
      </Typography>
      header="Hastayı Sil"
      footer={
        <DialogFooter onHide={hideDeleteDialog} onDelete={deletePatient} />
      }
    />
  );

  return (
    <>
      <Toolbar
        className="p-1"
        start={startContent}
        end={endContent}
        style={{
          border: "none",
          backgroundColor: "transparent",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
        }}
      />

      {patientDialog && (
        <PatientDialog
          initPatient={patient}
          onHide={hidePatientDialog}
          onSubmit={savePatient}
          onDelete={deletePatient}
        />
      )}
      {permissionDialog && (
        <PatientPermissionDialog
          initPermission={{ isSMS: patient.isSMS }}
          onHide={hidePermissionDialog}
          onSubmit={handleSavePermission}
        />
      )}

      {/* Confirm delete dialog */}
      {deletePatientDialog}
    </>
  );
}

export default PatientDetailToolbar;
