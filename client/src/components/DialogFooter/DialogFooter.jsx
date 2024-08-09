import React from "react";
import { Button } from "primereact";
import { useLoading } from "context/LoadingProvider";

// assets
import { useTheme } from "@mui/material/styles";

function DialogFooter({ disabled, onHide, onSubmit, onDelete }) {
  const theme = useTheme();
  const { loading } = useLoading();

  return (
    <>
      {onSubmit && (
        <Button
          disabled={disabled || loading.save}
          label={
            loading.save ? <i className="pi pi-spin pi-spinner" /> : "Kaydet"
          }
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
          disabled={loading.delete}
          label={
            loading.delete ? <i className="pi pi-spin pi-spinner" /> : "Sil"
          }
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
