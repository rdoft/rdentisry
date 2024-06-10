import React from "react";
import { Dropdown, Tag } from "primereact";

// assets
import "assets/styles/PatientDetail/VisitStatus.css";

function VisitStatus({ visit, onSubmit }) {
  // Status items
  const statusItems = [
    {
      status: "pending",
      label: "Bekleniyor",
      bgColor: "transparent",
      color: "#B1AFB0",
    },
    {
      status: "approved",
      label: "Onaylandı",
      bgColor: "transparent",
      color: "#22A069",
    },
  ];

  // Set status of the visit
  const status = visit.approvedDate ? statusItems[1] : statusItems[0];

  // HANDLERS -----------------------------------------------------------------
  // onChangeStatus handler
  const handleChange = () => {
    onSubmit(visit.approvedDate ? null : new Date());
  };

  // TEMPLATES -----------------------------------------------------------------
  // Status value template
  const statusValueTemplate = (option) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <i
          className={
            option.status === "approved"
              ? "pi pi-check-circle"
              : "pi pi-circle-fill"
          }
          style={{ color: option.color, marginRight: "2px" }}
        ></i>

        <Tag
          value={option.label}
          style={{
            backgroundColor: option.bgColor,
            color: option.color,
          }}
        />
      </div>
    );
  };

  // Status item template
  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option.label}
        style={{
          backgroundColor: option.bgColor,
          color: option.color,
        }}
      />
    );
  };

  return (
    <Dropdown
      value={status}
      options={statusItems}
      valueTemplate={statusValueTemplate}
      itemTemplate={statusItemTemplate}
      onChange={handleChange}
      className="visit-status-dropdown"
      style={{
        color: status.color,
        marginTop: "0.8rem",
      }}
    />
  );
}

export default VisitStatus;
