import React, { useState } from "react";
import { Divider } from "primereact";
import { Grid, Typography, Box, Avatar } from "@mui/material";
import { Edit } from "components/Button";
import AppointmentStatus from "./AppointmentStatus";

// assets
import { doctorAvatar } from "assets/images/avatars";

function AppointmentCard({ appointment, onClickEdit, onSubmit }) {
  const [isHover, setIsHover] = useState(false);

  // Set values as desired format
  const description = appointment.description;
  const duration = appointment.duration;
  const month = new Date(appointment.date).toLocaleDateString("tr-TR", {
    month: "long",
  });
  const day = new Date(appointment.date).toLocaleDateString("tr-TR", {
    day: "numeric",
  });
  const { name: dname = "", surname: dsurname = "" } = appointment.doctor || {};

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
          <Box display="flex" alignItems="center">
            <Typography
              variant="h3"
              fontWeight="bolder"
              mr={"3px"}
            >{`${day}`}</Typography>
            <Typography
              variant="caption"
              fontWeight="bolder"
            >{`${month}`}</Typography>
          </Box>

          {/* Time */}
          <Box display="flex" alignItems="center">
            <Typography variant="h6" mr={1}>
              ⏱️
            </Typography>
            <Typography variant="h5" mr={"3px"}>{`${duration}`}</Typography>
            <Typography variant="caption">dk.</Typography>
          </Box>

          {/* Doctor */}
          {dname && dsurname && (
            <Box display="flex" gap={1} alignItems="center">
              <Avatar
                alt="avatar"
                src={doctorAvatar}
                shape="circle"
                style={{ width: "16px", height: "16px", padding: "1px" }}
              />
              <Typography variant="caption" fontWeight="bolder" noWrap>
                {`Dt. ${dname} ${dsurname}`}
              </Typography>
            </Box>
          )}

          {/* Description */}
          {description && (
            <Box display="flex" gap={1} alignItems="start">
              <Typography variant="h6">🖋</Typography>
              <Box display="flex" flexDirection="column">
                {description.split("\n").map((line, index) => (
                  <Typography key={index} variant="body2">
                    {line}
                  </Typography>
                ))}{" "}
              </Box>
            </Box>
          )}
        </Grid>

        {/* Status */}
        <Grid container item xs={2} justifyContent="flex-start">
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
