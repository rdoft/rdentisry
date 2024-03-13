import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { activeItem } from "store/reducers/menu";
import { Grid, Typography } from "@mui/material";
import { Goto } from "components/Button";

// assets
import {
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";

function EventTitle({ event, step }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isHover, setIsHover] = useState(false);

  const { description, startTime, endTime } = event;
  const { id, name, surname } = event.patient;

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

  const showDescription = description && event.duration >= (step / 6) * 7;

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
    navigate(`/patients/${id}`);
    dispatch(activeItem({ openItem: ["patients"] }));
  };

  return (
    <Grid
      container
      justifyContent="space-between"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Grid item xs={8}>
        {/* Time */}
        <Grid item xs={12}>
          <Typography variant="caption">
            <ClockCircleOutlined /> {`${startHours}-${endHours}`}
          </Typography>
        </Grid>

        {/* Patient */}
        <Grid item xs={12}>
          <Typography variant="caption" fontWeight="bolder" noWrap>
            <UserOutlined /> {`${name} ${surname}`}
          </Typography>
        </Grid>

        {showDescription && (
          <Grid item xs={12}>
            <Typography variant="caption">
              <FileTextOutlined />{" "}
              {description.includes("\n") ||
              description.split(/\n/)[0].length > 24
                ? description.split(/\n/)[0].slice(0, 24) + " ..."
                : description.split(/\n/)[0]}
            </Typography>
          </Grid>
        )}
      </Grid>

      {isHover && (
        <Grid item xs="auto" m={0.5}>
          <Goto
            severity="info"
            onClick={handleClickEdit}
            style={{ color: "#3B5DBF", padding: "0.3rem", width: "auto" }}
            tooltip="Hasta sayfasına git"
          />
        </Grid>
      )}
    </Grid>
  );
}

export default EventTitle;
