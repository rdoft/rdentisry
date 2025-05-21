import React from "react";
import { Basic, Delete } from "components/Button";
import { useLoading } from "context/LoadingProvider";
import { SubscriptionController } from "components/Subscription";

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
  const { loading } = useLoading();

  return (
    <>
      {onHide && (
        <Basic
          label={labelHide}
          onClick={onHide}
          style={{
            width: "fit-content",
          }}
        />
      )}
      {onDelete && (
        <SubscriptionController disabled={!controlSubscription}>
          <Delete
            label={labelDelete}
            loading={loading.delete}
            variant="outlined"
            onClick={onDelete}
            autoFocus={!onSubmit}
            style={{
              width: "fit-content",
            }}
          />
        </SubscriptionController>
      )}
      {onSubmit && (
        <SubscriptionController type="storage" disabled={!controlSubscription}>
          <Basic
            disabled={disabled}
            label={labelSubmit}
            loading={loading.save}
            variant="main"
            severity="primary"
            onClick={onSubmit}
            autoFocus
            style={{
              width: "fit-content",
            }}
          />
        </SubscriptionController>
      )}
    </>
  );
}

export default DialogFooter;
