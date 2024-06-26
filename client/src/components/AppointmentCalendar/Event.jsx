import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { activeItem } from "store/reducers/menu";
import { Grid, Typography, Box, Avatar, Tooltip } from "@mui/material";
import { Goto } from "components/Button";

// assets
import { doctorAvatar, patientAvatar } from "assets/images/avatars";
import "react-big-calendar/lib/css/react-big-calendar.css";

function Event({ event, step }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isHover, setIsHover] = useState(false);
  const [isHoverName, setIsHoverName] = useState(false);

  const { description, start, end } = event;
  const { id, name: pname, surname: psurname } = event.patient;
  const { name: dname = "", surname: dsurname = "" } = event.doctor || {};

  const startHours = start.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endHours = end.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const lg = event.duration >= step;
  const sm = event.duration <= step / 2;

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
      placement="bottom"
      followCursor={true}
    >
      <Grid
        container
        onContextMenu={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        direction="column"
        style={{ height: "100%" }}
      >
        <Grid container>
          {/* Time */}
          <Grid item xs={sm ? 5 : 12}>
            <Box display="flex" gap={1} alignItems="center">
              {!sm && <Typography variant="h5">⏱️</Typography>}
              <Typography variant="caption" fontWeight="bold">
                {`${startHours}-${endHours}`}
              </Typography>
            </Box>
          </Grid>

          {/* Patient */}
          <Grid
            item
            xs={sm && 7}
            onClick={handleClick}
            onMouseEnter={handleMouseEnterPatient}
            onMouseLeave={handleMouseLeavePatient}
          >
            <Box display="flex" gap={1} alignItems="center">
              {!sm && (
                <Avatar
                  alt="avatar"
                  src={patientAvatar}
                  shape="circle"
                  style={{ width: "18px", height: "18px", padding: "1px" }}
                />
              )}
              <Typography
                variant={!sm ? "h6" : "caption"}
                fontWeight="bolder"
                noWrap
              >
                {`${pname} ${psurname}`}
              </Typography>

              {/* Goto buttton */}
              {isHover && (
                <Goto
                  severity="info"
                  style={{
                    color: "#3B5DBF",
                    padding: "0.1rem",
                    width: "auto",
                  }}
                />
              )}
            </Box>
          </Grid>

          {/* Doctor */}
          {lg && dname && (
            <Grid item xs={12}>
              <Box display="flex" gap={1} alignItems="start">
                <Avatar
                  alt="avatar"
                  src={doctorAvatar}
                  shape="circle"
                  style={{ width: "18px", height: "18px", padding: "1px" }}
                />
                <Typography variant="caption" noWrap>
                  {`Dt. ${dname} ${dsurname}`}
                </Typography>
              </Box>
            </Grid>
          )}

          {lg && description && (
            <Grid item xs={12}>
              <Box display="flex" gap={1} alignItems="start">
                <Typography variant="h6">🖋</Typography>
                <Typography variant="caption">
                  {description.includes("\n") ||
                  description.split(/\n/)[0].length > 24
                    ? description.split(/\n/)[0].slice(0, 24) + " ..."
                    : description.split(/\n/)[0]}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Tooltip>
  );
}

export default Event;
