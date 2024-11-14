import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Typography, Grid } from "@mui/material";
import { DataTable, Column, Tag, Menu, ConfirmDialog } from "primereact";
import {
  AppointmentDialog,
  PatientDialog,
  PatientPermissionDialog,
} from "components/Dialog";
import { DialogFooter } from "components/DialogFooter";
import { More, Delete } from "components/Button";
import { useLoading } from "context/LoadingProvider";
import { LoadingController } from "components/Loadable";
import { SkeletonDataTable } from "components/Skeleton";
import PatientTableToolbar from "./PatientTableToolbar";

// assets
import { useTheme } from "@mui/material/styles";
import "assets/styles/PatientTable/PatientTable.css";

// services
import { PatientService, AppointmentService } from "services";

function PatientsTable() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  // Set the default values
  const dt = useRef(null);
  const menu = useRef(null);

  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dialogs, setDialogs] = useState({
    patient: false,
    appointment: false,
    permission: false,
    deletePatient: false,
    deletePatients: false,
  });

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("PatientTable");
    PatientService.getPatients(true, { signal })
      .then((response) => {
        const _patients = response.data.map((item) => ({
          ...item,
          fullName: `${item.name} ${item.surname}`,
        }));
        setPatients(_patients);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("PatientTable"));

    return () => {
      controller.abort();
    };
  }, [startLoading, stopLoading]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of patients and set patients value
  const getPatients = async () => {
    let response;
    let patients;

    try {
      response = await PatientService.getPatients(true);
      patients = response.data.map((item) => ({
        ...item,
        fullName: `${item.name} ${item.surname}`,
      }));
      // Set new patients
      setPatients(patients);
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // Save patient (create/update)
  const savePatient = async (patient) => {
    try {
      startLoading("save");
      if (patient.id) {
        // Update the patient
        await PatientService.updatePatient(patient);
      } else {
        // Create a new patient
        await PatientService.savePatient(patient);
      }

      // Set the patients and close the dialog
      await getPatients();
      hidePatientDialog();
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // save appointment
  const saveAppointment = async (appointment) => {
    try {
      startLoading("save");
      await AppointmentService.saveAppointment(appointment);
      hideAppointmentDialog();
      toast.success("Yeni randevu başarıyla eklendi");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  //  Delete patient
  const deletePatient = async () => {
    let _patients;
    let _selectedPatients;

    try {
      startLoading("delete");
      await PatientService.deletePatient(patient.id);

      // Remove deleted patient from patients and selectedPatients
      _patients = patients.filter((item) => item.id !== patient.id);
      _selectedPatients = selectedPatients
        ? selectedPatients.filter((item) => item.id !== patient.id)
        : null;
      // Set the list of patients and selected patients
      setPatients(_patients);
      setSelectedPatients(_selectedPatients);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
    }

    // Close delete dialog and empty patient variable
    hideDeletePatientDialog();
    setPatient(null);
  };

  // Delete selected patients
  const deletePatients = async () => {
    let _patients;
    let selectedIds;

    // Get IDs of selected patients
    selectedIds = selectedPatients.map((item) => item.id);

    try {
      startLoading("delete");
      await PatientService.deletePatients(selectedIds);

      // Remove deleted patients from the patients
      _patients = patients.filter((item) => !selectedPatients.includes(item));
      // Set patients with new value
      // And set selected patients to empty
      if (selectedIds.length > 1) {
        toast.success("Seçili hastalar başarıyla silindi!");
      } else {
        toast.success("Seçili hasta başarıyla silindi!");
      }
      setPatients(_patients);
      setSelectedPatients(null);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
    }

    // Close the dialog and set selec
    hideDeletePatientsDialog();
  };

  // Save permission selected patients
  const savePatientsPermission = async (permission) => {
    let selectedIds;

    try {
      // Get IDs of selected patients
      selectedIds = selectedPatients.map((item) => item.id);

      startLoading("save");
      await PatientService.updatePatientsPermission(selectedIds, permission);

      if (selectedIds.length > 1) {
        toast.success("Seçili hastaların izinleri başarıyla güncellendi!");
      } else {
        toast.success("Seçili hastanın izni başarıyla güncellendi!");
      }
      await getPatients();
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // Show patient dialog
  const showPatientDialog = (patient) => {
    patient ? setPatient(patient) : setPatient(null);
    setDialogs({ ...dialogs, patient: true });
  };

  // Hide patient dialog
  const hidePatientDialog = () => {
    setDialogs({ ...dialogs, patient: false, permission: false });
  };

  // Show add appointment dialog
  const showAppointmentDialog = (patient) => {
    setPatient(patient);
    setDialogs({ ...dialogs, appointment: true });
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setDialogs({ ...dialogs, appointment: false });
  };

  // Show confirm delete patient dialog
  const showDeletePatientDialog = (patient) => {
    setPatient(patient);
    setDialogs({ ...dialogs, deletePatient: true });
  };

  // Show confirm delete patients dialog
  const showDeletePatientsDialog = () => {
    setDialogs({ ...dialogs, deletePatients: true });
  };

  // Hide delete patient dialog
  const hideDeletePatientDialog = () => {
    setDialogs({ ...dialogs, deletePatient: false });
  };

  // Hide delete patients dialog
  const hideDeletePatientsDialog = () => {
    setDialogs({ ...dialogs, deletePatients: false });
  };

  // Show permission dialog
  const showPermissionDialog = (patient) => {
    setPatient(patient);
    setDialogs({ ...dialogs, permission: true });
  };

  // Hide permission dialog
  const hidePermissionDialog = () => {
    setDialogs({ ...dialogs, permission: false });
  };

  // onInput handler for search
  const handleInputSearch = (event) => {
    setTimeout(() => setGlobalFilter(event.target.value), 400);
  };

  // onSelectedChange handler
  const handleChangeSelection = (event) => {
    setSelectedPatients(event.value);
  };

  // onRowClick handler for goto patient page
  const handleRowClick = (event) => {
    // Check if the click target is the checkbox
    if (
      event.originalEvent.target.classList.contains("p-selection-column") ||
      event.originalEvent.target.classList.contains("p-checkbox-icon")
    ) {
      return;
    }
    // Navigate to the patient page
    navigate(`/patients/${event.data.id}`);
  };

  // onRowMouseEnter handler for display buttons
  const handleRowMouseEnter = (event) => {
    setRowIndex(event.data.id);
  };

  // onRowMouseLeave handler for hide buttons
  const handleRowMouseLeave = () => {
    setRowIndex(null);
  };

  // Save permission
  const handleSavePermission = (permission) => {
    hidePermissionDialog();
    savePatient({
      ...patient,
      isSMS: permission.isSMS,
    });
  };

  // TEMPLATES -----------------------------------------------------------------
  // Menu item for the patient action buttons
  const actionButton = (patient) => {
    return (
      <>
        <More
          style={{
            width: "2rem",
            height: "2rem",
            color: theme.palette.text.primary,
          }}
          onClick={(event) => {
            event.stopPropagation();
            menu.current.toggle(event);
          }}
        />
        <Menu
          model={[
            {
              label: "Görüntüle / Düzenle",
              icon: "pi pi-external-link",
              style: { fontSize: "0.9rem" },
              command: () => showPatientDialog(patient),
            },
            {
              label: "Hastaya Git",
              icon: "pi pi-arrow-circle-right",
              style: { fontSize: "0.9rem" },
              command: () => navigate(`/patients/${patient.id}`),
            },
            {
              label: "Randevu Ekle",
              icon: "pi pi-calendar-plus",
              style: { fontSize: "0.9rem" },
              command: () => showAppointmentDialog(patient),
            },
            {
              label: "İzinleri Yönet",
              icon: "pi pi-key",
              style: { fontSize: "0.9rem" },
              command: () => showPermissionDialog(patient),
            },
            {
              template: () => (
                <Delete
                  label="Sil"
                  style={{ width: "100%", textAlign: "start" }}
                  onClick={() => showDeletePatientDialog(patient)}
                />
              ),
            },
          ]}
          ref={menu}
          id="popup_menu"
          popup
        />
      </>
    );
  };

  // Payment status of the patient (overdue or not)
  const status = (patient) => {
    let value;
    if (patient.overdue) {
      value = (
        <Typography variant="caption" fontWeight="bold">
          Gecikmiş Taksit
        </Typography>
      );
    } else if (patient.waiting) {
      value = null;
    } else if (patient.dept > 0) {
      value = (
        <Grid container alignItems="center" justifyContent="center">
          <Grid item>
            <Typography variant="caption" component="span">
              ₺
            </Typography>
            <Typography variant="caption" component="span" fontWeight="bold">
              {patient.dept.toLocaleString("tr-TR", {
                style: "decimal",
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Grid>
        </Grid>
      );
    } else {
      value = null;
    }

    return value ? (
      <Tag
        value={value}
        style={{
          backgroundColor: theme.palette.background.error,
          color: theme.palette.text.error,
          padding: "0.1rem 0.5rem",
        }}
      />
    ) : null;
  };

  // Delete patient dialog template
  const deletePatientDialog = (
    <ConfirmDialog
      visible={dialogs.deletePatient}
      onHide={hideDeletePatientDialog}
      message=<Typography variant="body1">
        <strong>
          {patient?.name} {patient?.surname}
        </strong>{" "}
        isimli hastayı silmek istediğinizden emin misiniz?
      </Typography>
      header="Hastayı Sil"
      footer={
        <DialogFooter
          onHide={hideDeletePatientDialog}
          onDelete={deletePatient}
        />
      }
    />
  );

  // Delete patients dialog template
  const deletePatientsDialog = (
    <ConfirmDialog
      visible={dialogs.deletePatients}
      onHide={hideDeletePatientsDialog}
      message=<Typography variant="body1">
        <strong>{selectedPatients?.length || 0}</strong> adet hastayı silmek
        istediğinizden emin misiniz?
      </Typography>
      header="Hastaları Sil"
      footer={
        <DialogFooter
          onHide={hideDeletePatientsDialog}
          onDelete={deletePatients}
        />
      }
    />
  );

  // Return the PatientTable
  return (
    <div className="datatable-crud">
      <div className="card">
        {/* Patient table toolbar */}
        <PatientTableToolbar
          selectedCount={selectedPatients?.length}
          onClickAdd={showPatientDialog}
          onClickDelete={showDeletePatientsDialog}
          onClickPermission={savePatientsPermission}
          onInput={handleInputSearch}
        />

        <LoadingController name="PatientTable" skeleton={<SkeletonDataTable />}>
          <DataTable
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            ref={dt}
            value={patients}
            globalFilter={globalFilter}
            selection={selectedPatients}
            onSelectionChange={handleChangeSelection}
            onRowMouseEnter={handleRowMouseEnter}
            onRowMouseLeave={handleRowMouseLeave}
            onRowClick={handleRowClick}
            selectionMode="checkbox"
            responsiveLayout="scroll"
            dataKey="id"
            paginator
            rows={10}
            rowHover={true}
            dragSelection={true}
            currentPageReportTemplate="({totalRecords} hasta)"
            emptyMessage="Hiçbir sonuç bulunamadı"
            filterLocale="tr-TR"
          >
            {/* Checkbox */}
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
              bodyStyle={{ height: "4.5rem" }}
              exportable={false}
            ></Column>
            {/* TC */}
            <Column
              field="idNumber"
              header="Kimlik Numarası"
              sortable
              style={{ width: "12rem" }}
            ></Column>
            {/* Name */}
            <Column
              field="fullName"
              header="Ad Soyad"
              body={(patient) => (
                <span>
                  <strong>{patient.name}</strong> {patient.surname}
                </span>
              )}
              sortable
            ></Column>
            {/* Status tags */}
            <Column
              field="dept"
              body={status}
              sortable
              style={{ width: "10rem" }}
            ></Column>
            {/* Phone */}
            <Column
              field="phone"
              header="Telefon"
              style={{ width: "10rem" }}
            ></Column>
            {/* Action buttons */}
            <Column
              body={(patient) =>
                patient.id === rowIndex ? actionButton(patient) : null
              }
              style={{ width: "10rem", textAlign: "end" }}
            ></Column>
          </DataTable>
        </LoadingController>
      </div>

      {/* Patient information  */}
      {dialogs.patient && (
        <PatientDialog
          initPatient={patient}
          onHide={hidePatientDialog}
          onSubmit={savePatient}
        />
      )}

      {/* Appointment dialog */}
      {dialogs.appointment && (
        <AppointmentDialog
          initAppointment={{
            patient: {
              id: patient.id,
              idNumber: patient.idNumber,
              name: patient.name,
              surname: patient.surname,
              phone: patient.phone,
              birthYear: patient.birthYear,
            },
          }}
          onHide={hideAppointmentDialog}
          onSubmit={saveAppointment}
        />
      )}

      {/* Permission dialog */}
      {dialogs.permission && (
        <PatientPermissionDialog
          initPermission={{ isSMS: patient.isSMS }}
          onHide={hidePermissionDialog}
          onSubmit={handleSavePermission}
        />
      )}

      {/* Confirm delete dialog */}
      {deletePatientDialog}
      {deletePatientsDialog}
    </div>
  );
}

export default PatientsTable;
