import React, { useState, useEffect, useRef } from "react";

import { DataTable, Column, Toast } from "primereact";
import PatientDialog from "./PatientDialog";
import DeletePatientDialog from "./DeletePatientDialog";
import DeletePatientsDialog from "./DeletePatientsDialog";
import PatientTableToolbar from "./PatientTableToolbar";
import ActionGroup from "components/ActionGroup/ActionGroup";

// assets
// import classes from "assets/styles/PatientList.module.css";

// services
import { PatientService } from "services";
import AppointmentDialog from "components/AppointmentDialog/AppointmentDialog";
import { AppointmentService } from "services/index";

function PatientsTable() {
  // Set default empty Patient
  let emptyPatient = {
    id: null,
    idNumber: "",
    name: "",
    surname: "",
    phone: "",
    birthYear: "",
  };

  // Set the default values
  const [patient, setPatient] = useState(emptyPatient);
  const [patients, setPatients] = useState(null);
  const [patientDialog, setPatientDialog] = useState(false);
  const [deletePatientDialog, setDeletePatientDialog] = useState(false);
  const [deletePatientsDialog, setDeletePatientsDialog] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  // Set the page on loading
  useEffect(() => {
    getPatients();
  }, []);

  // SHOW/HIDE OPTIONS --------------------------------------------------------
  // Show add patient dialog
  const showAddPatientDialog = () => {
    setPatient(emptyPatient);
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
    // setAppointment({ ...appointment, patientId: patient.id });
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
      response = await PatientService.getPatients();
      patients = response.data;
      // Set new patients
      setPatients(patients);
    } catch (error) {
      // Set error status and show error toast message
      toast.current.show({
        severity: "error",
        summary: "Oops!",
        detail: "Bağlantı hatası, bir süre sonra yeniden deneyiniz",
        life: 3000,
      });
    }
  };

  // Save patient (create/update)
  const savePatient = async (patient) => {
    let response;
    let index;
    let _patients;

    try {
      // Copy patients into new variable
      _patients = [...patients];

      if (patient.id) {
        // Update the patient
        // PUT /patients/:patientId
        await PatientService.updatePatient(patient);
        // Find the index of the patinet in the patients array
        index = patients.findIndex((item) => item.id === patient.id);
        _patients[index] = patient;
      } else {
        // Create a new patient
        // POST /patients
        response = await PatientService.savePatient(patient);
        // Set created patient's id, and add into patients
        patient.id = response.data.id;
        _patients.push(patient);
      }

      // Set the patients and close the dialog
      setPatients(_patients);
      setPatientDialog(false);
    } catch (error) {
      // Set error status and show error toast message
      toast.current.show({
        severity: "error",
        life: 3000,
        summary: "Opps!",
        detail:
          error.response?.status < 500
            ? error.response.data
            : "Bağlantı hatası, bir süre sonra yeniden deneyiniz",
      });
    }
  };

  // save appointment
  const saveAppointment = async (appointment) => {
    try {
      const response = await AppointmentService.saveAppointment(appointment);

      console.log(response)
    } catch (error) {
      console.log(error);
    }
  };

  //  Delete patient
  const deletePatient = async () => {
    let _patients;
    let _selectedPatients;

    try {
      // DELETE /patients/:patientId
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
      // Set error status and show error toast message
      toast.current.show({
        severity: "error",
        summary: "Hasta silinemedi",
        detail: "Bağlantı hatası, bir süre sonra yeniden deneyiniz",
        life: 3000,
      });
    }

    // Close delete dialog and empty patient variable
    setDeletePatientDialog(false);
    setPatient(emptyPatient);
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
      setPatients(_patients);
      setSelectedPatients(null);
    } catch (error) {
      // Set error status and show error toast message
      toast.current.show({
        severity: "error",
        summary: "Seçilen hastalar silinemedi",
        detail: "Bağlantı hatası, bir süre sonra yeniden deneyiniz",
        life: 3000,
      });
    }

    // Close the dialog and set selec
    setDeletePatientsDialog(false);
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange patient inside children handler
  const handleChangePatient = (patient) => {
    setPatient(patient);
  };

  // onInput handler for search
  const handleInputSearch = (event) => {
    setGlobalFilter(event.target.value);
  };

  // onSelectedChange handler
  const handleChangeSelection = (event) => {
    setSelectedPatients(event.value);
  };

  // onRowMouseEnter handler for display buttons
  const handleRowMouseEnter = (event) => {
    setRowIndex(event.data.id);
  };

  // onRowMouseLeave handler for hide buttons
  const handleRowMouseLeave = () => {
    setRowIndex(null);
  };

  // Return the PatientTable
  return (
    <div className="datatable-crud">
      <Toast ref={toast} position="bottom-right" />

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
          selectionMode="checkbox"
          responsiveLayout="scroll"
          dataKey="id"
          paginator
          rows={10}
          currentPageReportTemplate="({totalRecords} hasta)"
        >
          {/* Checkbox */}
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
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
          {/* Action buttons */}
          <Column
            body={(patient) =>
              patient.id === rowIndex ? (
                <ActionGroup
                  label="Randevu"
                  onClickAdd={() => showAppointmentDialog(patient)}
                />
              ) : null
            }
          ></Column>
          {/* Patient action buttons */}
          <Column
            body={(patient) => (
              <ActionGroup
                onClickEdit={() => showEditPatientDialog(patient)}
                onClickDelete={() => showConfirmDeletePatientDialog(patient)}
              />
            )}
            style={{ width: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      {/* Patient information and confirmation dialogs  */}
      {patientDialog && (
        <PatientDialog
          patient={patient}
          onChange={handleChangePatient}
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
          _appointment={{ patient }}
          onHide={hideAppointmentDialog}
          onSubmit={saveAppointment}
        />
      )}
    </div>
  );
}

export default PatientsTable;
