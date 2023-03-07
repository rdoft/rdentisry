import React, { useState, useEffect, useRef, useCallback } from "react";

import { DataTable, Column, Toast } from "primereact";
import PatientDialog from "./PatientDialog";
import DeletePatientDialog from "./DeletePatientDialog";
import DeletePatientsDialog from "./DeletePatientsDialog";
import PatientTableToolbar from "./PatientTableToolbar";
import PatientAction from "./PatientAction";

// services
import { PatientService } from "services";

// import classes from "assets/styles/PatientList.module.css";

// TODO: [RDEN-29] Add controll mechanism for the services
// TODO: [RDEN-32] Add comments in the save,delete,get patient functions

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
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
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

  // SERVICES -----------------------------------------------------------------
  // Get the list of patients and set patients value
  const getPatients = async () => {
    setError(null);
    let response;
    let patients;

    try {
      // GET /patients
      response = await PatientService.getPatients();
      patients = response.data;

      setPatients(patients);
    } catch (error) {
      setError(error.message);
    }
  };

  // Save patient (create/update)
  const savePatient = async (patient) => {
    let response;
    let index;
    let _patients = [...patients];

    if (patient.id) {
      // TODO: service update patient
      index = patients.findIndex((item) => item.id === patient.id);
      _patients[index] = patient;
      // toast.current.show({
      //   severity: "success",
      //   summary: "Successful",
      //   detail: "Patient Updated",
      //   life: 3000,
      // });
    } else {
      // POST /patients
      response = await PatientService.savePatient(patient);
      patient.id = response.data.id;
      _patients.push(patient);
      // toast.current.show({
      //   severity: "success",
      //   summary: "Successful",
      //   detail: "Patient Created",
      //   life: 3000,
      // });
    }

    setPatients(_patients);
    setPatientDialog(false);
  };

  //  Delete patient
  const deletePatient = async () => {
    let _patients;
    let _selectedPatients;

    // DELETE /patients/:patientId
    await PatientService.deletePatient(patient.id);

    _patients = patients.filter((item) => item.id !== patient.id);
    _selectedPatients = selectedPatients
      ? selectedPatients.filter((item) => item.id !== patient.id)
      : null;

    setPatients(_patients);
    setSelectedPatients(_selectedPatients);
    setDeletePatientDialog(false);
    setPatient(emptyPatient);
    // toast.current.show({
    //   severity: "success",
    //   summary: "Silindi",
    //   life: 3000,
    // });
  };

  // Delete selected patients
  const deletePatients = async () => {
    let _patients;
    let selectedIds;

    // Get IDs of selected patients
    selectedIds = selectedPatients.map((item) => item.id);
    // DELETE /patients?patientId=
    await PatientService.deletePatients(selectedIds);
    // Filter patients
    _patients = patients.filter((item) => !selectedPatients.includes(item));

    // Update states
    setPatients(_patients);
    setDeletePatientsDialog(false);
    setSelectedPatients(null);
    // toast.current.show({
    //   severity: "success",
    //   summary: "Silindi",
    //   life: 3000,
    // });
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

  // Get the content of the Patients list
  // and control the loading/error state
  // function getContent() {
  //   let content = <Alert severity="info">Hiç kayıt yok</Alert>;
  //   if (patients.length > 0) {
  //     // <ul className={classes["patient-list"]}>
  //     content = (
  //       <List className="patient-list">
  //         {patients.map((patient) => (
  //           <Patient
  //             name={patient.name}
  //             surname={patient.surname}
  //             phone={patient.phone}
  //           />
  //         ))}
  //       </List>
  //     );
  //   }
  //   if (error) {
  //     content = <Alert severity="error">{error}</Alert>;
  //   }
  //   if (loading) {
  //     content = <CircularProgress />;
  //   }
  //   return content;
  // }

  // TEMPLATES ----------------------------------------------------------------
  // Patient action buttons template
  const getPatientAction = (patient) => {
    return (
      <PatientAction
        onClickEdit={() => showEditPatientDialog(patient)}
        onClickDelete={() => showConfirmDeletePatientDialog(patient)}
      />
    );
  };

  return (
    <div className="datatable-crud">
      <Toast ref={toast} />

      <div className="card">
        {/* Patient table toolbar */}
        <PatientTableToolbar
          visibleDelete={selectedPatients?.length ? true : false}
          onClickAdd={showAddPatientDialog}
          onClickDelete={showConfirmDeletePatientsDialog}
          onInput={handleInputSearch}
        />

        <DataTable
          ref={dt}
          value={patients}
          selection={selectedPatients}
          onSelectionChange={handleChangeSelection}
          dataKey="id"
          paginator
          rows={10}
          currentPageReportTemplate="Toplam hasta sayısı: {totalRecords}"
          globalFilter={globalFilter}
          responsiveLayout="scroll"
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
            style={{ minWidth: "12rem" }}
          ></Column>
          {/* Name */}
          <Column
            field="name"
            header="Ad"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          {/* Surname */}
          <Column
            field="surname"
            header="Soyad"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          {/* Phone */}
          <Column
            field="phone"
            header="Telefon"
            style={{ minWidth: "12rem" }}
          ></Column>
          {/* Action buttons */}
          <Column
            body={getPatientAction}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      {/* Patient information dialog  */}
      <PatientDialog
        patient={patient}
        visible={patientDialog}
        onChange={handleChangePatient}
        onHide={hidePatientDialog}
        onSubmit={savePatient}
      />

      <DeletePatientDialog
        visible={deletePatientDialog}
        patient={patient}
        onHide={hideDeletePatientDialog}
        onDelete={deletePatient}
      />

      <DeletePatientsDialog
        visible={deletePatientsDialog}
        selectedPatients={selectedPatients}
        onHide={hideDeletePatientsDialog}
        onDelete={deletePatients}
      />
    </div>
  );
}

export default PatientsTable;
