import React, { useState, useRef } from "react";
import { Menu, Divider } from "primereact";
import { Grid, Typography, Box } from "@mui/material";
import { More, Reminder, Basic, Delete } from "components/Button";
import { LoadingIcon, ReminderStatus } from "components/Other";
import { SubscriptionController } from "components/Subscription";
import AppointmentStatus from "./AppointmentStatus";

// assets
import { useTheme } from "@mui/material/styles";

function AppointmentCard({
  appointment,
  onClickEdit,
  onSubmit,
  onReminder,
  onDelete,
}) {
  const theme = useTheme();
  const menu = useRef(null);

  const [loading, setLoading] = useState(false);

  // Set values as desired format
  const { description, duration, date, status, reminderStatus } = appointment;
  const { name: dname = "", surname: dsurname = "" } = appointment.doctor || {};
  const { isSMS = false } = appointment.patient || {};
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

  // HANDLERS -----------------------------------------------------------------
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

  // Send reminder
  const sendReminder = async () => {
    await onReminder(appointment);
  };

  // onDelete handler
  const handleDelete = () => {
    onDelete(appointment);
  };

  // TEMPLATES ----------------------------------------------------------------
  const actionButton = (
    <>
      <More
        variant="text"
        severity="secondary"
        size="small"
        onClick={(event) => {
          menu.current.toggle(event);
        }}
      />
      <Menu
        model={[
          {
            template: () => (
              <Basic
                label="Görüntüle / Düzenle"
                icon="pi pi-external-link"
                onClick={handleClickEdit}
              />
            ),
          },
          ...(showApprove
            ? [
                {
                  template: () => (
                    <Basic
                      label="Onayla"
                      icon="pi pi-check"
                      severity="primary"
                      onClick={() => handleChangeReminderStatus("approved")}
                    />
                  ),
                },
              ]
            : showRemoveApprove
            ? [
                {
                  template: () => (
                    <Basic
                      label="Onayı Kaldır"
                      icon="pi pi-times"
                      onClick={() => handleChangeReminderStatus(null)}
                    />
                  ),
                },
              ]
            : []),
          ...(onDelete
            ? [
                {
                  template: () => (
                    <Delete
                      label="Sil"
                      onClick={handleDelete}
                      style={{ width: "100%", textAlign: "start" }}
                    />
                  ),
                },
              ]
            : []),
          ...(showSendReminder
            ? [
                {
                  template: () => (
                    <>
                      <Divider type="solid" className="my-2" />
                      <SubscriptionController
                        type="sms"
                        style={{ width: "100%" }}
                      >
                        <Reminder
                          label="Hatırlatma Gönder"
                          disabled={!isSMS}
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
                      <SubscriptionController
                        type="sms"
                        style={{ width: "100%" }}
                      >
                        <Reminder
                          label="Hasta Onayına Gönder"
                          icon="pi pi-send"
                          disabled={!isSMS}
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
        style={{ padding: "0.25rem" }}
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
        onContextMenu={handleRightClick}
      >
        {/* Reminder Status */}
        <Grid item xs={2} textAlign="center">
          {appointment.status === "active" && (
            <ReminderStatus
              status={appointment.reminderStatus}
              errorMessage={appointment.sms?.error}
              style={{
                backgroundColor:
                  appointment.sms?.error &&
                  appointment.reminderStatus !== "approved"
                    ? theme.palette.background.error
                    : theme.palette.text.primary,
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
          <Box display="flex" gap={1} alignItems="center">
            <i
              className={`fi ${
                duration <= 15
                  ? "fi-rr-time-quarter-past"
                  : duration <= 30
                  ? "fi-rr-time-half-past"
                  : duration <= 45
                  ? "fi-rr-time-quarter-to"
                  : "fi-rr-time-oclock"
              }`}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></i>
            <Typography variant="h5">{`${duration}`}</Typography>
            <Typography variant="caption">dk.</Typography>
          </Box>

          {/* Doctor */}
          {dname && dsurname && (
            <Box display="flex" gap={1} alignItems="center">
              <i
                className="fi fi-rr-user-md"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></i>
              <Typography variant="caption" fontWeight="bolder" noWrap>
                {`Dt. ${dname} ${dsurname}`}
              </Typography>
            </Box>
          )}

          {/* Description */}
          {description && (
            <Box display="flex" gap={1} alignItems="start">
              <i
                className="fi fi-rr-comment"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></i>
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
          {actionButton}
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
