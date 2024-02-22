import React, { useState } from "react";
import { Divider } from "primereact";
import { Grid, Typography } from "@mui/material";
import { Edit } from "components/Button";
import AppointmentStatus from "./AppointmentStatus";

// assets
import {
  ClockCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "assets/styles/PatientDetail/AppointmentCard.css";

function AppointmentCard({ appointment, onClickEdit, onSubmit }) {
  const [isHover, setIsHover] = useState(false);

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

  return (
    <>
      <Grid
        container
        alignItems="center"
        style={{ marginTop: "1em", marginBottom: "1em" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Grid item xs={9}>
          {/* Date */}
          <Typography variant="h5" sx={{ fontWeight: "regular" }}>
            <ScheduleOutlined /> {`${date}`}
          </Typography>

          {/* Time */}
          <Typography variant="h5" sx={{ fontWeight: "regular" }}>
            <ClockCircleOutlined /> {`${start} - ${end}`}
          </Typography>

          {/* Description */}
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

        {/* Status */}
        <Grid container item xs={2} justifyContent="flex-end">
          <AppointmentStatus appointment={appointment} onSubmit={onSubmit} />
        </Grid>

        {/* Edit Button */}
        {isHover && (
          <Grid container item xs={1} justifyContent="flex-end">
            <Edit onClick={handleClickEdit} />
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Divider style={{ margin: 0 }} />
        </Grid>
      </Grid>
    </>
  );
}

export default AppointmentCard;
