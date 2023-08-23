import React, { useState, useRef } from "react";
import { Tag, Divider } from "primereact";
import { Grid, Typography } from "@mui/material";

import ActionGroup from "components/ActionGroup/ActionGroup";

// assets
import {
  ClockCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

function AppointmentCard({ appointment, onClickEdit }) {
  // const menu = useRef(null);
  const [isHover, setIsHover] = useState(false);

  // Set status of the appointment
  const getStatus = (status) => {
    switch (status) {
      case "active":
        return { value: "Bekleniyor", severity: "info" };

      case "completed":
        return { value: "Tamamlandı", severity: "success" };

      case "canceled":
        return { value: "İptal Edildi", severity: "danger" };

      case "absent":
        return { value: "Gelmedi", severity: "warning" };
    }
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
  }

  // // TEMPLATES ----------------------------------------------------------
  // // Set menuItems
  // const menuItems = [
  //   {
  //     label: "Düzenle",
  //     command: () => {},
  //   },
  //   {
  //     label: "Sil",
  //     command: () => {
  //       onDelete(appointment);
  //     },
  //   },
  // ];

  return (
    <div onClick={handleClickEdit} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Grid
        container
        alignItems="center"
        style={{ marginTop: "1em", marginBottom: "1em", cursor:"pointer" }}
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
          <Tag value={status.value} severity={status.severity} />
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
    </div>
  );
}

export default AppointmentCard;
