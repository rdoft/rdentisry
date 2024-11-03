import React from "react";
import { Divider, Typography } from "@mui/material";
import { DialogTemp } from "components/Dialog";

function UpgradeConfirmationDialog({ pricing, onHide, onSubmit }) {
  return (
    <DialogTemp
      isValid={true}
      onHide={onHide}
      onSubmit={onSubmit}
      header="Üyelik Planı Güncelleme"
      labelSubmit="Onayla"
      labelHide="İptal"
      position="center"
      style={{ width: "50%" }}
    >
      {/* Divider */}
      <Divider type="solid" className="mt-0" />

      {/* Form */}
      <div className="flex mt-4">
        <Typography variant="h5" fontWeight="regular">
          Bu değişiklik{" "}
          <b>
            {new Date().toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </b>{" "}
          tarihinden itibaren geçerli olacaktır. Yeni üyelik ücreti{" "}
          <b>{pricing.price}</b> TL <b>her ay</b> hesabınızdan tahsil
          edilecektir.
        </Typography>
      </div>
      <div className="flex mt-3">
        <Typography variant="h5" fontWeight="regular">
          Lütfen devam etmek için onaylayın.
        </Typography>
      </div>
    </DialogTemp>
  );
}

export default UpgradeConfirmationDialog;
