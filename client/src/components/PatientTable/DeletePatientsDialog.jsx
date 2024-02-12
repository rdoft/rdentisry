import React from "react";
import { Dialog } from "primereact";
import { DialogFooter } from "components/DialogFooter";

function DeletePatientsDialog({ selectedPatients, onHide, onDelete }) {
  return (
    <Dialog
      visible
      style={{ width: "450px" }}
      header={`Hastaları Sil`}
      modal
      footer={<DialogFooter onHide={onHide} onDelete={onDelete} />}
      onHide={onHide}
    >
      <div className="confirmation-content">
        <span>
          <strong>{selectedPatients?.length ?? 0}</strong> adet hastayı silmek
          istediğinizden emin misiniz?
        </span>
      </div>
    </Dialog>
  );
}

export default DeletePatientsDialog;
