import React from "react";
import { Button } from "primereact";

function DialogFooter({ onHide, onSubmit, onDelete }) {
  return (
    <React.Fragment>
      {onSubmit && (
        <Button
          label="Kaydet"
          className="p-button p-button-info"
          onClick={onSubmit}
        />
      )}
      {onDelete && (
        <Button label="Sil" className="p-button-danger" onClick={onDelete} />
      )}
      {onHide && (
        <Button
          label="İptal"
          className="p-button-text p-button-secondary"
          onClick={onHide}
        />
      )}
    </React.Fragment>
  );
}

export default DialogFooter;
