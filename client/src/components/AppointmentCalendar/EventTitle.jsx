import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { Edit } from "components/Button";

// assets
import {
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";

function EventTitle({ event, step, onClickEdit }) {
  const [isHover, setIsHover] = useState(false);

  const { description, startTime, endTime, id } = event;
  const { name, surname } = event.patient;

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const startHours = startDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endHours = endDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const showName = event.duration >= step;
  const showDescription = description && event.duration >= (step / 3) * 4;

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
  const handleClickEdit = (event) => {
    event.stopPropagation();
    onClickEdit(id);
  };

  return (
    <Grid
      container
      justifyContent="space-between"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Grid item xs={9}>
        <Typography variant="h6">
          <ClockCircleOutlined /> {`${startHours}-${endHours}`}
        </Typography>
        {showName && (
          <Typography variant="h5" noWrap>
            <UserOutlined /> {`${name} ${surname}`}
          </Typography>
        )}

        {showDescription && (
          <Typography variant="h6">
            <FileTextOutlined />{" "}
            {description.includes("\n") ||
            description.split(/\n/)[0].length > 24
              ? description.split(/\n/)[0].slice(0, 24) + " ..."
              : description.split(/\n/)[0]}
          </Typography>
        )}
      </Grid>

      {isHover && (
        <Grid item xs={2} m={0.5}>
          <Edit severity="info" onClick={handleClickEdit} style={{ color: "#3B5DBF" }}/>
        </Grid>
      )}
    </Grid>
  );
}

export default EventTitle;
