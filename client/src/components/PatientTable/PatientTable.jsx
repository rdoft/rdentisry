import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import { DataTable, Column, Image } from "primereact";
import DeletePatientDialog from "./DeletePatientDialog";
import DeletePatientsDialog from "./DeletePatientsDialog";
import PatientTableToolbar from "./PatientTableToolbar";
import ActionGroup from "components/ActionGroup/ActionGroup";
import { AppointmentDialog, PatientDialog } from "components/Dialog";

// assets
import "assets/styles/PatientTable/PatientTable.css";
import { LiraDangerIcon } from "assets/images/icons";

// services
import { PatientService, AppointmentService } from "services";

function PatientsTable() {
  const navigate = useNavigate();

  // Set the default values
  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [patientDialog, setPatientDialog] = useState(false);
  const [deletePatientDialog, setDeletePatientDialog] = useState(false);
  const [deletePatientsDialog, setDeletePatientsDialog] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  // Set the page on loading
  useEffect(() => {
    getPatients();
  }, []);

  // SHOW/HIDE OPTIONS --------------------------------------------------------
  // Show add patient dialog
  const showAddPatientDialog = () => {
    setPatient(null);
    setPatientDialog(true);
  };

  // Show edit patient dialog
  const showEditPatientDialog = (patient) => {
    setPatient({ ...patient });
    setPatientDialog(true);
  };

  // Show confirm delete patient dialog
  const showConfirmDeletePatientDialog = (patient) => {
    setPatient(patient);
    setDeletePatientDialog(true);
  };

  // Show confirm delete patients dialog
  const showConfirmDeletePatientsDialog = () => {
    setDeletePatientsDialog(true);
  };

  // Show add appointment dialog
  const showAppointmentDialog = (patient) => {
    setPatient({ ...patient });
    setAppointmentDialog(true);
  };

  // Hide patient dialog
  const hidePatientDialog = () => {
    setPatientDialog(false);
  };

  // Hide delete patient dialog
  const hideDeletePatientDialog = () => {
    setDeletePatientDialog(false);
  };

  // Hide delete patients dialog
  const hideDeletePatientsDialog = () => {
    setDeletePatientsDialog(false);
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setAppointmentDialog(false);
  };

  // SERVICES -----------------------------------------------------------------
  // Get the list of patients and set patients value
  const getPatients = async () => {
    let response;
    let patients;

    try {
      // GET /patients
      response = await PatientService.getPatients(true);
      patients = response.data;
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
      setPatientDialog(false);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // save appointment
  const saveAppointment = async (appointment) => {
    try {
      await AppointmentService.saveAppointment(appointment);
      setAppointmentDialog(false);
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
    setDeletePatientDialog(false);
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
    setDeletePatientsDialog(false);
  };

  // HANDLERS -----------------------------------------------------------------
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
    navigate(`/patients/${event.data.id}?tab=payments`);
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
  const handleClickAddAppointment = (event, patient) => {
    event.stopPropagation();
    showAppointmentDialog(patient);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Payment status of the patient
  const status = (patient) =>
    // Control overdue status
    patient.overdue ? <Image src={LiraDangerIcon} width="75%" /> : null;

  // Return the PatientTable
  return (
    <div className="datatable-crud">
      <div className="card">
        {/* Patient table toolbar */}
        <PatientTableToolbar
          visibleDelete={selectedPatients?.length ? true : false}
          onClickAdd={showAddPatientDialog}
          onClickDelete={showConfirmDeletePatientsDialog}
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
          sortField="overdue"
          sortOrder={-1}
          dragSelection={true}
          currentPageReportTemplate="({totalRecords} hasta)"
          emptyMessage="Hiçbir sonuç bulunamadı"
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
            field="name"
            header="Ad"
            sortable
            style={{ width: "12rem" }}
          ></Column>
          {/* Surname */}
          <Column
            field="surname"
            header="Soyad"
            sortable
            style={{ width: "12rem" }}
          ></Column>
          {/* Phone */}
          <Column
            field="phone"
            header="Telefon"
            style={{ width: "10rem" }}
          ></Column>
          {/* Status tags */}
          <Column
            field="overdue"
            body={status}
            sortable
            style={{ width: "4rem", textAlign: "center" }}
          ></Column>
          {/* Action buttons */}
          {!window.matchMedia("(hover: none)").matches && (
            <Column
              body={(patient) =>
                patient.id === rowIndex ? (
                  <ActionGroup
                    label="Randevu"
                    onClickAdd={(event) =>
                      handleClickAddAppointment(event, patient)
                    }
                  />
                ) : null
              }
            ></Column>
          )}
          {/* Patient action buttons */}
          <Column
            body={(patient) =>
              patient.id === rowIndex ? (
                <ActionGroup
                  onClickEdit={() => showEditPatientDialog(patient)}
                  onClickDelete={() => showConfirmDeletePatientDialog(patient)}
                />
              ) : null
            }
            style={{ width: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      {/* Patient information and confirmation dialogs  */}
      {patientDialog && (
        <PatientDialog
          _patient={patient}
          onHide={hidePatientDialog}
          onSubmit={savePatient}
        />
      )}

      {deletePatientDialog && (
        <DeletePatientDialog
          patient={patient}
          onHide={hideDeletePatientDialog}
          onDelete={deletePatient}
        />
      )}

      {deletePatientsDialog && (
        <DeletePatientsDialog
          selectedPatients={selectedPatients}
          onHide={hideDeletePatientsDialog}
          onDelete={deletePatients}
        />
      )}

      {/* Appointment dialog */}
      {appointmentDialog && (
        <AppointmentDialog
          _appointment={{
            patient: {
              id: patient.id,
              idNumber: patient.idNumber,
              name: patient.name,
              surname: patient.surname,
              phone: patient.phone,
              birthYear: patient.birthYear,
            },
          }}
          doctors={doctors}
          patients={patients}
          setDoctors={setDoctors}
          setPatients={setPatients}
          onHide={hideAppointmentDialog}
          onSubmit={saveAppointment}
        />
      )}
    </div>
  );
}

export default PatientsTable;
