import React from "react";
import { Dialog } from "primereact";
import DialogFooter from "components/DialogFooter/DialogFooter";

function DeletePatientsDialog({ selectedPatients, onHide, onDelete }) {
  return (
    <Dialog
      visible
      style={{ width: "450px" }}
      header={`${selectedPatients?.length ?? 0} Hastayı Sil`}
      modal
      footer={<DialogFooter onHide={onHide} onDelete={onDelete} />}
      onHide={onHide}
    >
      <div className="confirmation-content">
        <span>Seçili hastaları silmek istediğinizden emin misiniz?</span>
      </div>
    </Dialog>
  );
}

export default DeletePatientsDialog;
