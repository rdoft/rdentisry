import React from "react";
import { Dialog } from "primereact";
import DialogFooter from "components/DialogFooter/DialogFooter";

function DeletePatientDialog({ patient, onHide, onDelete }) {
  return (
    <Dialog
      visible
      style={{ width: "450px" }}
      header="Hastayı Sil"
      modal
      footer={<DialogFooter onHide={onHide} onDelete={onDelete} />}
      onHide={onHide}
    >
      <div className="confirmation-content">
        {patient && (
          <span>
            <b>{`${patient.name} ${patient.surname}`}</b> isimli hastayı silmek
            istediğinizden emin misiniz?
          </span>
        )}
      </div>
    </Dialog>
  );
}

export default DeletePatientDialog;
