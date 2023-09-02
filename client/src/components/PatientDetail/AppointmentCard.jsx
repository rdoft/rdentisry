import React, { useState } from "react";
import { Tag, Divider, Dropdown } from "primereact";
import { Grid, Typography } from "@mui/material";

import ActionGroup from "components/ActionGroup/ActionGroup";

// assets
import {
  ClockCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "assets/styles/PatientDetail/AppointmentCard.css";

function AppointmentCard({ appointment, onClickEdit }) {
  const [isHover, setIsHover] = useState(false);

  // Status items
  const items = [
    { status: "active", value: "Bekleniyor", severity: "info" },
    { status: "completed", value: "Tamamlandı", severity: "success" },
    { status: "canceled", value: "İptal Edildi", severity: "danger" },
    { status: "absent", value: "Gelmedi", severity: "warning" },
  ];

  // Set status of the appointment
  const getStatus = (status) => {
    return items.find((item) => item.status === status);
  };

  // Set values as desired format
  const status = getStatus(appointment.status);
  const description = appointment.description;
  const date = new Date(appointment.date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const start = new Date(appointment.startTime).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(appointment.endTime).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // HANDLERS -----------------------------------------------------------------
  // onMouseEnter handler for display buttons
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  // onMouseLeave handler for hide buttons
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  // onClickEdit handler
  const handleClickEdit = () => {
    onClickEdit(appointment);
  };

  // TEMPLATES ----------------------------------------------------------
  // Dropdwon item template
  const statusTemplate = (option, props) => {
    return <Tag value={option.value} severity={option.severity} />;
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        style={{ marginTop: "1em", marginBottom: "1em", cursor: "pointer" }}
        onClick={handleClickEdit}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Grid item xs={8}>
          <Typography variant="h5" sx={{ fontWeight: "regular" }}>
            <ScheduleOutlined /> {`${date}`}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "regular" }}>
            <ClockCircleOutlined /> {`${start} - ${end}`}
          </Typography>
          {description && (
            <Typography variant="h6" sx={{ fontWeight: "light" }}>
              <FileTextOutlined />{" "}
              {description.includes("\n") ||
              description.split(/\n/)[0].length > 24
                ? description.split(/\n/)[0].slice(0, 24) + " ..."
                : description.split(/\n/)[0]}
            </Typography>
          )}
        </Grid>
        <Grid container item xs={2} justifyContent="flex-end">
          <Dropdown
            className="statusDropdown"
            value={status.value}
            options={items}
            optionLabel="value"
            valueTemplate={statusTemplate}
            itemTemplate={statusTemplate}
            scrollHeight={null}
            // onChange={(event) => handleChange(event)}
            onClick={(event) => event.stopPropagation()}
          />
        </Grid>
        {isHover && (
          <Grid container item xs={1} justifyContent="flex-end">
            {/* <Menu model={menuItems} popup ref={menu} /> */}
            <ActionGroup onClickEdit={handleClickEdit} />
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs={11}>
          <Divider style={{ margin: 0 }} />
        </Grid>
      </Grid>
    </>
  );
}

export default AppointmentCard;
