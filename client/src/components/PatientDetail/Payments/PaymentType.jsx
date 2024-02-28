import React from "react";
import { MultiStateCheckbox } from "primereact";

function PaymentType({ type, onChange }) {
  // Payment types
  const paymentTypes = [
    { value: "cash", label: "Nakit", icon: "pi pi-wallet" },
    { value: "card", label: "Kredi Kartı", icon: "pi pi-credit-card" },
    {
      value: "transfer",
      label: "Transfer(Banka)",
      icon: "pi pi-arrow-right-arrow-left",
    },
    { value: "other", label: "Diğer", icon: "pi pi-file" },
  ];

  const { label, icon } =
    paymentTypes.find((item) => item.value === type) ?? {};

  return (
    <>
      {onChange ? (
        <>
          <MultiStateCheckbox
            value={type}
            name="type"
            onChange={onChange}
            options={paymentTypes}
            optionValue="value"
          />
          <small>{label ? label : "Seçiniz"}</small>
        </>
      ) : (
        label &&
        icon && (
          <>
            <i
              className={icon}
              style={{ fontSize: "0.7rem", paddingRight: "0.3rem" }}
            ></i>
            <span>{label}</span>
          </>
        )
      )}
    </>
  );
}

export default PaymentType;
