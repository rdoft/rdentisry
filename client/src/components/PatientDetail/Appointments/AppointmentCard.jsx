import React, { useState, useEffect } from "react";
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

function AppointmentCard({ appointment, onClickEdit, onChangeStatus }) {
  const [isHover, setIsHover] = useState(false);
  const [status, setStatus] = useState(null);

  // Set the doctors from dropdown on loading
  useEffect(() => {
    getStatus(appointment.status);
  }, [appointment]);

  // Status items
  const statusItems = [
    { status: "active", label: "Bekleniyor", bgColor: "#E8F0FF", color: "#1E7AFC" },
    { status: "completed", label: "Tamamlandı", bgColor: "#DFFCF0", color: "#22A069" },
    { status: "canceled", label: "İptal Edildi", bgColor: "#FFD2CB", color: "#EF4444" },
    { status: "absent", label: "Gelmedi", bgColor: "#FFFADD", color: "#FFD200" },
  ];

  // Set status of the appointment
  const getStatus = (status) => {
    const status_ = statusItems.find((item) => item.status === status);
    setStatus(status_);
  };

  // Set values as desired format
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

  // onChange handler
  const handleChangeStatus = (status) => {
    appointment.status = status.status;
    onChangeStatus(appointment);
  };

  // TEMPLATES ----------------------------------------------------------
  // Dropdwon item template
  const statusTemplate = (option) => {
    return (
      <Tag value={option.label} style={{ backgroundColor: option.bgColor, color: option.color }} />
    );
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        style={{ marginTop: "1em", marginBottom: "1em" }}
        // onClick={handleClickEdit}
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
          {status && (
            <Dropdown
              value={status}
              options={statusItems}
              optionLabel="desc"
              valueTemplate={statusTemplate}
              itemTemplate={statusTemplate}
              onChange={(event) => handleChangeStatus(event.value)}
              onClick={(event) => event.stopPropagation()}
              scrollHeight={null}
              className="statusDropdown"
            />
          )}
        </Grid>
        {isHover && (
          <Grid container item xs={1} justifyContent="flex-end">
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
