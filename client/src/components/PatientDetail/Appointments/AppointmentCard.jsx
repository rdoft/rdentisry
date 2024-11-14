import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Menu, Divider } from "primereact";
import { Grid, Typography, Box, Avatar } from "@mui/material";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { More, Reminder } from "components/Button";
import { LoadingIcon, ReminderStatus } from "components/Other";
import { SubscriptionController } from "components/Subscription";
import AppointmentStatus from "./AppointmentStatus";

// assets
import { doctorAvatar } from "assets/images/avatars";
import { useTheme } from "@mui/material/styles";

// services
import { ReminderService } from "services";

function AppointmentCard({ appointment, onClickEdit, onSubmit }) {
  const theme = useTheme();
  const { startLoading, stopLoading } = useLoading();
  const { refresh } = useSubscription();

  const menu = useRef(null);

  const [loading, setLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);

  // Set values as desired format
  const { description, duration, date, status, reminderStatus } = appointment;
  const { name: dname = "", surname: dsurname = "" } = appointment.doctor || {};
  const month = new Date(date).toLocaleDateString("tr-TR", {
    month: "long",
  });
  const day = new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
  });

  // Set conditions for sending reminder and approval
  const showSendReminder = status === "active" && reminderStatus === "approved";
  const showSendApprove =
    status === "active" && (!reminderStatus || reminderStatus === "sent");
  const showRemoveApprove =
    status === "active" && reminderStatus === "approved";
  const showApprove = status === "active" && reminderStatus !== "approved";

  // SERVICES -----------------------------------------------------------------
  // Send appointment reminder
  const sendReminder = async () => {
    try {
      startLoading("send");
      await ReminderService.remindAppointment(appointment.id);
      refresh();
      toast.success("Hatırlatma mesajı başarıyla gönderildi");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("send");
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

  // onChangeStatus handler
  const handleChangeStatus = async (status) => {
    setLoading(true);
    await onSubmit({
      ...appointment,
      status,
    });
    setLoading(false);
  };

  // onChangeReminderStatus handler
  const handleChangeReminderStatus = async (reminderStatus) => {
    await onSubmit({
      ...appointment,
      reminderStatus: reminderStatus,
    });
  };

  // onRightClick handler
  const handleRightClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    menu.current.toggle(event);
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
            style: { fontSize: "0.8rem" },
            command: handleClickEdit,
          },
          ...(showApprove
            ? [
                {
                  label: "Onayla",
                  icon: "pi pi-check",
                  style: { fontSize: "0.8rem" },
                  command: () => handleChangeReminderStatus("approved"),
                },
              ]
            : showRemoveApprove
            ? [
                {
                  label: "Onayı Kaldır",
                  icon: "pi pi-times",
                  style: { fontSize: "0.8rem" },
                  command: () => handleChangeReminderStatus(null),
                },
              ]
            : []),
          ...(showSendReminder
            ? [
                {
                  template: () => (
                    <>
                      <Divider type="solid" className="my-2" />
                      <SubscriptionController type="sms">
                        <Reminder
                          label="Hatırlatma Gönder"
                          style={{ width: "100%" }}
                          onClick={sendReminder}
                        />
                      </SubscriptionController>
                    </>
                  ),
                },
              ]
            : []),
          ...(showSendApprove
            ? [
                {
                  template: () => (
                    <>
                      <Divider type="solid" className="my-2" />
                      <SubscriptionController type="sms">
                        <Reminder
                          label="Hasta Onayına Gönder"
                          icon="pi pi-send"
                          style={{ width: "100%" }}
                          onClick={sendReminder}
                        />
                      </SubscriptionController>
                    </>
                  ),
                },
              ]
            : []),
        ]}
        ref={menu}
        id="popup_menu"
        popup
        style={{ padding: "0.5rem" }}
      />
    </>
  );

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-around"
        style={{ marginTop: "1em", marginBottom: "1em" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleRightClick}
      >
        {/* Reminder Status */}
        <Grid item xs={2} textAlign="center">
          {appointment.status === "active" && (
            <ReminderStatus
              status={appointment.reminderStatus}
              style={{
                backgroundColor: theme.palette.text.primary,
                padding: "0.5rem",
              }}
            />
          )}
        </Grid>

        {/* Appointment Info */}
        <Grid item xs={6}>
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
