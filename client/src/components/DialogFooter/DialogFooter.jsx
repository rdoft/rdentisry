import React from "react";
import { Button } from "primereact";

function DialogFooter({ disabled, onHide, onSubmit, onDelete }) {
  return (
    <>
      {onSubmit && (
        <Button
          disabled={disabled}
          label="Kaydet"
          size="small"
          className="p-button p-button-info"
          onClick={onSubmit}
        />
      )}
      {onDelete && (
        <Button
          label="Sil"
          size="small"
          className="p-button-danger"
          onClick={onDelete}
        />
      )}
      {onHide && (
        <Button
          label="İptal"
          size="small"
          className="p-button-text p-button-secondary"
          onClick={onHide}
        />
      )}
    </>
  );
}

export default DialogFooter;
