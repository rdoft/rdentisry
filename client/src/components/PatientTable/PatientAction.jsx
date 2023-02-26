import React from "react";
import { Button } from "primereact";

function PatientAction({ onClickEdit, onClickDelete }) {
  return (
    <React.Fragment>
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-secondary mr-2"
        onClick={onClickEdit}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-danger"
        onClick={onClickDelete}
      />
    </React.Fragment>
  );
}

export default PatientAction;
