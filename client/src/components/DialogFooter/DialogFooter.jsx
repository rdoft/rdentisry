import React from "react";
import { Button } from "primereact";
import { useLoading } from "context/LoadingProvider";
import { SubscriptionController } from "components/Subscription";

// assets
import { useTheme } from "@mui/material/styles";

function DialogFooter({
  disabled,
  labelSubmit = "Kaydet",
  labelHide = "İptal",
  labelDelete = "Sil",
  controlSubscription,
  onHide,
  onSubmit,
  onDelete,
}) {
  const theme = useTheme();
  const { loading } = useLoading();

  return (
    <>
      {onSubmit && (
        <SubscriptionController type="storage" disabled={!controlSubscription}>
          <Button
            disabled={disabled || loading.save}
            label={
              loading.save ? (
                <i className="pi pi-spin pi-spinner" />
              ) : (
                labelSubmit
              )
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
        </SubscriptionController>
      )}
      {onDelete && (
        <SubscriptionController disabled={!controlSubscription}>
          <Button
            disabled={loading.delete}
            label={
              loading.delete ? (
                <i className="pi pi-spin pi-spinner" />
              ) : (
                labelDelete
              )
            }
            size="small"
            className="p-button-danger"
            onClick={onDelete}
            autoFocus={!onSubmit}
          />
        </SubscriptionController>
      )}
      {onHide && (
        <Button
          label={labelHide}
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
