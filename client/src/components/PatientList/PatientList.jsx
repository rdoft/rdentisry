import React, { useState, useEffect, useRef, useCallback } from "react";

import { Avatar } from "@mui/material";
import { classNames } from "primereact/utils";
import {
  DataTable,
  Column,
  Toast,
  Button,
  Toolbar,
  Dialog,
  InputText,
} from "primereact";
import Patient from "./Patient";

// services
import { PatientService } from "services";

// import classes from "assets/styles/PatientList.module.css";
import avatarPatient from "assets/images/avatars/patient-avatar.png";

function PatientList() {
  let emptyPatient;

  // Set default empty Patient
  emptyPatient = {
    id: null,
    name: "",
    surname: "",
    phone: "",
    idNumber: "",
  };

  // Set the default values
  const [patient, setPatient] = useState(emptyPatient);
  const [patients, setPatients] = useState(null);
  const [patientDialog, setPatientDialog] = useState(false);
  const [deletePatientDialog, setDeletePatientDialog] = useState(false);
  const [deletePatientsDialog, setDeletePatientsDialog] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  // TODO: Make components individual functions
  // Get the list of patients and set patients value
  const getPatients = useCallback(async () => {
    setError(null);
    let response;
    let patients;

    try {
      response = await PatientService.getPatients();
      patients = response.data.map((patient) => {
        return {
          id: patient.PatientId,
          name: patient.Name,
          surname: patient.Surname,
          phone: patient.Phone,
          idNumber: patient.IdNumber,
        };
      });

      setPatients(patients);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Set the page on loading
  useEffect(() => {
    getPatients();
  }, [getPatients]);

  // SHOW/HIDE OPTIONS --------------------------------------------------------
  // Show add patient dialog
  const showAddPatientDialog = () => {
    setPatient(emptyPatient);
    setSubmitted(false);
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
    setSubmitted(false);
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
  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };
  // Save patient (create/update)
  const savePatient = () => {
    setSubmitted(true);
    let index;
    let _patient;
    let _patients;

    _patients = [...patients];
    _patient = {
      id: patient.id,
      idNumber: patient.idNumber.trim(),
      name: patient.name.trim(),
      surname: patient.surname.trim(),
      phone: patient.phone.trim(),
    };

    if (
      _patient.idNumber &&
      _patient.name &&
      _patient.surname &&
      _patient.phone
    ) {
      if (patient.id) {
        // TODO: service update patient
        index = patients.findIndex((item) => item.id === patient.id);
        _patients[index] = _patient;
        // toast.current.show({
        //   severity: "success",
        //   summary: "Successful",
        //   detail: "Patient Updated",
        //   life: 3000,
        // });
      } else {
        // TODO: service create new patient
        _patient.id = createId();
        _patients.push(_patient);
        // toast.current.show({
        //   severity: "success",
        //   summary: "Successful",
        //   detail: "Patient Created",
        //   life: 3000,
        // });
      }

      setPatients(_patients);
      setPatientDialog(false);
      // setPatient(emptyPatient);
    }
  };
  //  Delete patient
  const deletePatient = () => {
    // TODO: service delete patient
    let _patients = patients.filter((item) => item.id !== patient.id);
    let _selectedPatients = selectedPatients
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
  const deletePatients = () => {
    let _patients;
    // TODO: delete patients
    _patients = patients.filter((item) => !selectedPatients.includes(item));
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
  // onChange handler
  const handleChange = (event, attr) => {
    const value = (event.target && event.target.value) || "";
    let _patient;

    _patient = { ...patient };
    _patient[`${attr}`] = value;
    setPatient(_patient);
  };
  // onInput handler for search
  const handleSearchInput = (event) => {
    setGlobalFilter(event.target.value);
  };
  // onSelectedChange handler
  const handleSelectionChange = (event) => {
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
  // Toolbar template
  const toolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Hasta Ekle"
          icon="pi pi-plus"
          className="p-button-text p-button-info mr-2"
          onClick={showAddPatientDialog}
        />
        <Button
          label="Sil"
          icon="pi pi-trash"
          className="p-button-text p-button-danger"
          onClick={showConfirmDeletePatientsDialog}
          visible={selectedPatients?.length ? true : false}
        />
      </React.Fragment>
    );
  };
  // Action body template
  const actionBodyTemplate = (patient) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-text p-button-secondary mr-2"
          onClick={() => showEditPatientDialog(patient)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger"
          onClick={() => showConfirmDeletePatientDialog(patient)}
        />
      </React.Fragment>
    );
  };
  // Header
  const header = () => {
    return (
      <div className="table-header">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={handleSearchInput}
            placeholder="Ara..."
          />
        </span>
      </div>
    );
  };
  // Patient dialog footer
  const patientDialogFooter = () => {
    return (
      <React.Fragment>
        <Button
          label="İptal"
          icon="pi pi-times"
          className="p-button-text p-button-secondary"
          onClick={hidePatientDialog}
        />
        <Button
          label="Kaydet"
          icon="pi pi-check"
          className="p-button-text p-button-info"
          onClick={savePatient}
        />
      </React.Fragment>
    );
  };
  // Delete Patient dialog footer
  const deletePatientDialogFooter = () => {
    return (
      <React.Fragment>
        <Button
          label="Sil"
          className="p-button-danger"
          onClick={deletePatient}
        />
        <Button
          label="İptal"
          className="p-button-text p-button-secondary"
          onClick={hideDeletePatientDialog}
        />
      </React.Fragment>
    );
  };
  // Delete Patients dialog footer
  const deletePatientsDialogFooter = () => {
    return (
      <React.Fragment>
        <Button
          label="Sil"
          className="p-button-danger"
          onClick={deletePatients}
        />
        <Button
          label="İptal"
          className="p-button-text p-button-secondary"
          onClick={hideDeletePatientsDialog}
        />
      </React.Fragment>
    );
  };

  return (
    <div className="datatable-crud">
      <Toast ref={toast} />

      <div className="card">
        <Toolbar className="mb-4" left={toolbarTemplate}></Toolbar>

        <DataTable
          ref={dt}
          value={patients}
          selection={selectedPatients}
          onSelectionChange={handleSelectionChange}
          dataKey="id"
          paginator
          rows={10}
          currentPageReportTemplate="Toplam hasta sayısı: {totalRecords}"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>
          <Column
            field="idNumber"
            header="Kimlik Numarası"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="name"
            header="Ad"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="surname"
            header="Soyad"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="phone"
            header="Telefon"
            style={{ minWidth: "12rem" }}
          ></Column>
          {/* <Column field="patment" header="Kalan Ödeme" body={} sortable style={{ minWidth: '8rem' }}></Column> */}
          {/* <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column> */}
          {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={patientDialog}
        style={{ width: "450px" }}
        header={!patient.id ? "Yeni Hasta" : "Hasta Bilgileri"}
        modal
        className="p-fluid"
        footer={patientDialogFooter}
        onHide={hidePatientDialog}
      >
        <Avatar
          alt="patient-avatar"
          src={avatarPatient}
          sx={{ width: 100, height: 100, mb: 2, mx: "auto" }}
        />
        <div className="field">
          <label htmlFor="idNumber">TC Kimlik Numarası</label>
          <InputText
            id="idNumber"
            value={patient.idNumber}
            onChange={(e) => handleChange(e, "idNumber")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !patient.idNumber,
            })}
          />
          {submitted && !patient.idNumber && (
            <small className="p-error">Gerekli</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="name">Ad</label>
          <InputText
            id="name"
            value={patient.name}
            onChange={(e) => handleChange(e, "name")}
            required
            className={classNames({ "p-invalid": submitted && !patient.name })}
          />
          {submitted && !patient.name && (
            <small className="p-error">Gerekli</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="name">Soyad</label>
          <InputText
            id="surname"
            value={patient.surname}
            onChange={(e) => handleChange(e, "surname")}
            required
            className={classNames({
              "p-invalid": submitted && !patient.surname,
            })}
          />
          {submitted && !patient.surname && (
            <small className="p-error">Gerekli</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="phone">Telefon</label>
          <InputText
            id="phone"
            value={patient.phone}
            onChange={(e) => handleChange(e, "phone")}
            required
            className={classNames({ "p-invalid": submitted && !patient.phone })}
          />
          {submitted && !patient.phone && (
            <small className="p-error">Gerekli</small>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deletePatientDialog}
        style={{ width: "450px" }}
        header="Hastayı Sil"
        modal
        footer={deletePatientDialogFooter}
        onHide={hideDeletePatientDialog}
      >
        <div className="confirmation-content">
          {patient && (
            <span>
              <b>{`${patient.name} ${patient.surname}`}</b> isimli hastayı
              silmek istediğinizden emin misiniz?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deletePatientsDialog}
        style={{ width: "450px" }}
        header={`${selectedPatients?.length ?? 0} Hastayı Sil`}
        modal
        footer={deletePatientsDialogFooter}
        onHide={hideDeletePatientsDialog}
      >
        <div className="confirmation-content">
          {patient && (
            <span>Seçili hastaları silmek istediğinizden emin misiniz?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default PatientList;
