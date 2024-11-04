import React from "react";
import { Divider, Typography } from "@mui/material";
import { DialogTemp } from "components/Dialog";

function SubscriptionCancelDialog({ onHide, onSubmit }) {
  return (
    <DialogTemp
      isValid={true}
      onHide={onHide}
      onSubmit={onSubmit}
      header="Üyelik Planı İptali"
      labelSubmit="Üyeliği İptal Et"
      labelHide="Vazgeç"
      position="center"
      style={{ width: "50%" }}
    >
      {/* Divider */}
      <Divider type="solid" className="mt-0" />

      {/* Form */}
      <div className="flex mt-4">
        <Typography variant="h5" fontWeight="regular">
          Üyeliğiniz iptal edildiğinde, hesabınızdaki verilerinize erişim
          hakkınız kısıtlanacaktır. Verileriniz bir süre daha saklanacak ve daha
          sonra silinecektir.
        </Typography>
      </div>
      <div className="flex mt-3">
        <Typography variant="h5" fontWeight="regular">
          Devam etmek istediğinize emin misiniz?
        </Typography>
      </div>
    </DialogTemp>
  );
}

export default SubscriptionCancelDialog;
