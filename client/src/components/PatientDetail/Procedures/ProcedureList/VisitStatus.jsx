import React, { useState } from "react";
import { Dropdown, Tag } from "primereact";
import { Tooltip } from "@mui/material";
import { LoadingIcon } from "components/Other";

// assets
import { useTheme } from "@mui/material/styles";
import "assets/styles/PatientDetail/VisitStatus.css";

function VisitStatus({ visit, onSubmit }) {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  // Status items
  const statusItems = [
    {
      status: "pending",
      label: "Bekleniyor",
      bgColor: "transparent",
      color: theme.palette.text.info,
    },
    {
      status: "approved",
      label: "Onaylandı",
      bgColor: "transparent",
      color: theme.palette.text.success,
    },
  ];

  // Set status of the visit
  const status = visit.approvedDate ? statusItems[1] : statusItems[0];

  // HANDLERS -----------------------------------------------------------------
  // onChangeStatus handler
  const handleChange = async () => {
    setLoading(true);
    await onSubmit(visit.approvedDate ? null : new Date());
    setLoading(false);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Status value template
  const statusValueTemplate = (option) => {
    return (
      <div
        style={{ display: "flex", alignItems: "center", marginRight: "-4px" }}
      >
        <Tooltip
          placement="right"
          enterDelay={750}
          title={
            option.status === "approved" ? (
              <>
                <ul>
                  <li>
                    Seans onayı kaldırıldığında ücret ve indirim oranı üzerinde
                    değişiklik yapılabilir
                  </li>
                  <li>Toplam tutar hasta borcundan eksiltilir</li>
                  <li>
                    Daha önce oluşturulmuş ödeme planı varsa otomatik olarak
                    silinmez
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul>
                  <li>
                    Seans onaylandığında ücret ve indirim oranı üzerinde
                    değişiklik yapılamaz
                  </li>
                  <li>Toplam tutar hasta borcuna yansıtılır</li>
                  <li>Ödeme planı oluşturulabilir</li>
                </ul>
              </>
            )
          }
        >
          <div>
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
        </Tooltip>
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

  return loading ? (
    <LoadingIcon
      style={{
        padding: "0.35rem",
        marginTop: "0.8rem",
        justifyContent: "start",
      }}
    />
  ) : (
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
