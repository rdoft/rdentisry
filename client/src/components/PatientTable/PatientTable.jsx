import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { Typography, Grid } from "@mui/material";
import { DataTable, Column, Tag, ConfirmDialog } from "primereact";
import { AppointmentDialog, PatientDialog } from "components/Dialog";
import { DialogFooter } from "components/DialogFooter";
import { Add, Edit, Delete } from "components/Button";
import PatientTableToolbar from "./PatientTableToolbar";

// assets
import "assets/styles/PatientTable/PatientTable.css";

// services
import { PatientService, AppointmentService } from "services";

function PatientsTable() {
  const navigate = useNavigate();

  // Set the default values
  const dt = useRef(null);
  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dialogs, setDialogs] = useState({
    patient: false,
    appointment: false,
    deletePatient: false,
    deletePatients: false,
  });

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    PatientService.getPatients(true, { signal })
      .then((response) => {
        const _patients = response.data.map((item) => ({
          ...item,
          fullName: `${item.name} ${item.surname}`,
        }));
        setPatients(_patients);
      })
      .catch((error) => {
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    return () => {
      controller.abort();
    };
  }, [navigate]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of patients and set patients value
  const getPatients = async () => {
    let response;
    let patients;

    try {
      // GET /patients
      response = await PatientService.getPatients(true);
      patients = response.data.map((item) => ({
        ...item,
        fullName: `${item.name} ${item.surname}`,
      }));
      // Set new patients
      setPatients(patients);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Save patient (create/update)
  const savePatient = async (patient) => {
    try {
      if (patient.id) {
        // Update the patient
        await PatientService.updatePatient(patient);
        toast.success("Hasta bilgileri başarıyla güncellendi");
      } else {
        // Create a new patient
        await PatientService.savePatient(patient);
        toast.success("Yeni hasta başarıyla eklendi");
      }

      // Set the patients and close the dialog
      getPatients();
      hidePatientDialog();
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // save appointment
  const saveAppointment = async (appointment) => {
    try {
      await AppointmentService.saveAppointment(appointment);
      hideAppointmentDialog();
      toast.success("Yeni randevu başarıyla eklendi");
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  //  Delete patient
  const deletePatient = async () => {
    let _patients;
    let _selectedPatients;

    try {
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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
      // DELETE /patients?patientId=
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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }

    // Close the dialog and set selec
    hideDeletePatientsDialog();
  };

  // HANDLERS -----------------------------------------------------------------
  // Show patient dialog
  const showPatientDialog = (patient) => {
    patient ? setPatient(patient) : setPatient(null);
    setDialogs({ ...dialogs, patient: true });
  };

  // Hide patient dialog
  const hidePatientDialog = () => {
    setDialogs({ ...dialogs, patient: false });
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
    localStorage.setItem("activeTabIndex", 1);
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

  // onClick handler for add new appointment
  const handleAddAppointment = (event, patient) => {
    event.stopPropagation();
    showAppointmentDialog(patient);
  };

  // TEMPLATES -----------------------------------------------------------------
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
          backgroundColor: "#FFD2CB",
          color: "#EF4444",
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
          visibleDelete={selectedPatients?.length ? true : false}
          onClickAdd={showPatientDialog}
          onClickDelete={showDeletePatientsDialog}
          onInput={handleInputSearch}
        />

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
          {/* Phone */}
          <Column
            field="phone"
            header="Telefon"
            style={{ width: "10rem" }}
          ></Column>
          {/* Status tags */}
          <Column
            field="dept"
            body={status}
            sortable
            style={{ width: "10rem" }}
          ></Column>
          {/* Action buttons */}
          {!window.matchMedia("(hover: none)").matches && (
            <Column
              body={(patient) =>
                patient.id === rowIndex ? (
                  <Add
                    label="Randevu"
                    onClick={(e) => handleAddAppointment(e, patient)}
                  />
                ) : null
              }
              style={{ width: "10rem" }}
            ></Column>
          )}
          {/* Patient action buttons */}
          <Column
            body={(patient) =>
              patient.id === rowIndex ? (
                <>
                  <Edit onClick={() => showPatientDialog(patient)} />
                  <Delete onClick={() => showDeletePatientDialog(patient)} />
                </>
              ) : null
            }
            style={{ width: "10rem" }}
          ></Column>
        </DataTable>
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

      {/* Confirm delete dialog */}
      {deletePatientDialog}
      {deletePatientsDialog}
    </div>
  );
}

export default PatientsTable;
