import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Menu, Divider } from "primereact";
import { Grid, Typography, Box, Avatar } from "@mui/material";
import { More, Reminder } from "components/Button";
import { LoadingIcon } from "components/Other";
import AppointmentStatus from "./AppointmentStatus";

// assets
import { doctorAvatar } from "assets/images/avatars";
import { useTheme } from "@mui/material/styles";

// services
import { ReminderService } from "services";

function AppointmentCard({ appointment, onClickEdit, onSubmit }) {
  const theme = useTheme();

  const menu = useRef(null);

  const [loading, setLoading] = useState(false);
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
  const allowReminder =
    appointment.status === "active" &&
    (!appointment.reminderStatus || appointment.reminderStatus === "sent");

  // SERVICES -----------------------------------------------------------------
  // Send appointment reminder
  const sendReminder = async () => {
    try {
      await ReminderService.remindAppointment(appointment.id);
      toast.success("Hatırlatma mesajı başarıyla gönderildi");
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

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

  // handleChangeStatus handler
  const handleChangeStatus = async (status) => {
    setLoading(true);
    await onSubmit({
      ...appointment,
      status,
    });
    setLoading(false);
  };

  // TEMPLATES ----------------------------------------------------------------
  const actionButton = (
    <>
      <More
        style={{
          width: "2rem",
          height: "2rem",
          color: theme.palette.text.primary,
        }}
        onClick={(event) => {
          menu.current.toggle(event);
        }}
      />
      <Menu
        model={[
          {
            label: "Görüntüle / Düzenle",
            icon: "pi pi-external-link",
            style: { fontSize: "0.9rem" },
            command: handleClickEdit,
          },
          ...(allowReminder
            ? [
                {
                  template: () => (
                    <>
                      <Divider type="solid" className="my-2" />
                      <Reminder
                        label="Hatırlatma Gönder"
                        onClick={sendReminder}
                      />
                    </>
                  ),
                },
              ]
            : []),
        ]}
        ref={menu}
        id="popup_menu"
        popup
      />
    </>
  );

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="end"
        style={{ marginTop: "1em", marginBottom: "1em" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Grid item xs={7}>
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
        <Grid item xl={2} xs={3} textAlign="center">
          {loading ? (
            <LoadingIcon />
          ) : (
            <AppointmentStatus
              initStatus={appointment.status}
              onChange={handleChangeStatus}
            />
          )}
        </Grid>

        {/* Edit Button */}
        <Grid item xl={1} xs={1} textAlign="end">
          {isHover && actionButton}
        </Grid>
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
