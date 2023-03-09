import React, { useState, useEffect, useRef } from "react";

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

    // Copy patients into new variable
    _patients = [...patients];
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
      try {
        // POST /patients
        response = await PatientService.savePatient(patient);

        // Set created patient's id, and add into patients
        patient.id = response.data.id;
        _patients.push(patient);
      } catch (error) {
        // Set error status and show error toast message
        toast.current.show({
          severity: "error",
          summary: "Oops!",
          detail: "Hasta kaydedilemedi",
          life: 3000,
        });
      }
    }

    // Set the states
    setPatients(_patients);
    setPatientDialog(false);
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
        summary: "Opps!",
        detail: "Hasta silinemedi",
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
        summary: "Opps!",
        detail: "Seçilen hastalar silinemedi",
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
