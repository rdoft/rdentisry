import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { activeItem } from "store/reducers/menu";
import { Grid, Typography, Box, Avatar, Tooltip } from "@mui/material";
import { Goto } from "components/Button";

// assets
import { patientAvatar } from "assets/images/avatars";
import "react-big-calendar/lib/css/react-big-calendar.css";

function MonthEvent({ event }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isHover, setIsHover] = useState(false);
  const [isHoverName, setIsHoverName] = useState(false);

  const { start, end } = event;
  const { id, name: pname, surname: psurname } = event.patient;

  const startHours = start.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endHours = end.toLocaleTimeString("tr-TR", {
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
  // onMouseEnter handler for patient
  const handleMouseEnterPatient = () => {
    setIsHoverName(true);
  };

  // onMouseLeave handler for patient
  const handleMouseLeavePatient = () => {
    setIsHoverName(false);
  };

  // onClick handler
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/patients/${id}`);
    dispatch(activeItem({ openItem: ["patients"] }));
  };

  return (
    <Tooltip
      title={isHoverName ? "Hastaya git" : "Görüntüle / Düzenle"}
      placement="right"
      followCursor={true}
    >
      <Grid
        container
        onContextMenu={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Grid container>
          {isHover ? (
            <Grid
              item
              onClick={handleClick}
              onMouseEnter={handleMouseEnterPatient}
              onMouseLeave={handleMouseLeavePatient}
            >
              <Box display="flex" gap={1} alignItems="start">
                <Avatar
                  alt="avatar"
                  src={patientAvatar}
                  shape="circle"
                  style={{ width: "18px", height: "18px", padding: "1px" }}
                />
                <Typography variant="h6" fontWeight="bolder" noWrap>
                  {`${pname} ${psurname}`}
                </Typography>
                <Goto
                  severity="info"
                  style={{
                    color: "#3B5DBF",
                    padding: "0.1rem",
                    width: "auto",
                  }}
                />
              </Box>
            </Grid>
          ) : (
            <Grid item>
              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="h5">⏱️</Typography>
                <Typography variant="caption" fontWeight="bold">
                  {`${startHours}-${endHours}`}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Tooltip>
  );
}

export default MonthEvent;
