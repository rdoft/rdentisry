import React from "react";
import { Button } from "primereact";

// assets
import { useTheme } from "@mui/material/styles";

function DialogFooter({ disabled, onHide, onSubmit, onDelete }) {
  const theme = useTheme();

  return (
    <>
      {onSubmit && (
        <Button
          disabled={disabled}
          label="Kaydet"
          size="small"
          className="p-button p-button-info"
          onClick={onSubmit}
          autoFocus
          style={{
            color: theme.palette.common.white,
            backgroundColor: theme.palette.text.secondary,
            borderColor: theme.palette.text.secondary,
          }}
        />
      )}
      {onDelete && (
        <Button
          label="Sil"
          size="small"
          className="p-button-danger"
          onClick={onDelete}
          autoFocus={!onSubmit}
        />
      )}
      {onHide && (
        <Button
          label="İptal"
          size="small"
          className="p-button-text p-button-secondary"
          onClick={onHide}
          style={{
            color: theme.palette.text.primary,
          }}
        />
      )}
    </>
  );
}

export default DialogFooter;
