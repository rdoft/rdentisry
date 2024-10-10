import React, { useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoading } from "context/LoadingProvider";
import { activeItem } from "store/reducers/menu";
import { Menu, Divider } from "primereact";
import { Grid, Typography, Box, Tooltip } from "@mui/material";
import { More, Reminder } from "components/Button";
import { LoadingIcon, ReminderStatus } from "components/Other";

// assets
import { useTheme } from "@mui/material/styles";
import "react-big-calendar/lib/css/react-big-calendar.css";

// services
import { ReminderService } from "services";

function MonthEvent({ event, onSubmit }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { startLoading, stopLoading } = useLoading();

  const menu = useRef(null);

  const {
    id: eventId = null,
    status = null,
    reminderStatus = null,
    start,
    end,
    temp,
  } = event;
  const {
    id = null,
    name: pname = "",
    surname: psurname = "",
  } = event.patient || {};

  const startHours = start.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endHours = end.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
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
      await ReminderService.remindAppointment(eventId);
      toast.success("Hatırlatma mesajı başarıyla gönderildi");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("send");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onClick handler
  const handleRightClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    menu.current.toggle(event);
  };

  // onClick patient handler
  const handleClickPatient = () => {
    id && navigate(`/patients/${id}`);
    dispatch(activeItem({ openItem: ["patients"] }));
  };

  // onClick send reminder handler
  const handleClickSendReminder = (event) => {
    event.stopPropagation();
    eventId && sendReminder();
  };

  // onChangeReminderStatus handler
  const handleChangeReminderStatus = async (e, reminderStatus) => {
    e.stopPropagation();
    onSubmit({ ...event, reminderStatus });
  };

  // onMouseLeave handler
  const handleMouseLeave = (event) => {
    menu.current.hide(event);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Action button (more)
  const actionButton = (
    <>
      <More
        style={{
          width: "1.4rem",
          height: "1.2rem",
          padding: "0.25rem 0.5rem",
          color: theme.palette.text.event,
        }}
        onClick={(event) => {
          event.stopPropagation();
          menu.current.toggle(event);
        }}
      />
      <Menu
        model={[
          {
            label: "Hastaya Git",
            icon: "pi pi-arrow-circle-right",
            style: { fontSize: "0.8rem" },
            command: handleClickPatient,
          },
          {
            label: "Görüntüle / Düzenle",
            icon: "pi pi-external-link",
            style: { fontSize: "0.8rem" },
          },
          ...(showApprove
            ? [
                {
                  label: "Onayla",
                  icon: "pi pi-check",
                  style: { fontSize: "0.8rem" },
                  command: (event) =>
                    handleChangeReminderStatus(event.originalEvent, "approved"),
                },
              ]
            : showRemoveApprove
            ? [
                {
                  label: "Onayı Kaldır",
                  icon: "pi pi-times",
                  style: { fontSize: "0.8rem" },
                  command: (event) =>
                    handleChangeReminderStatus(event.originalEvent, null),
                },
              ]
            : []),
          ...(showSendReminder
            ? [
                {
                  template: () => (
                    <>
                      <Divider type="solid" className="my-2" />
                      <Reminder
                        label="Hatırlatma Gönder"
                        style={{ width: "100%" }}
                        onClick={handleClickSendReminder}
                      />
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
                      <Reminder
                        label="Hasta Onayına Gönder"
                        icon="pi pi-send"
                        style={{ width: "100%" }}
                        onClick={handleClickSendReminder}
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
        style={{ padding: "0.5rem" }}
      />
    </>
  );

  return temp ? (
    <LoadingIcon style={{ height: "100%", alignItems: "center" }} />
  ) : (
    <Tooltip title={`${startHours}-${endHours}`} placement="top" arrow>
      <Grid
        container
        position="relative"
        style={{ height: "100%" }}
        onContextMenu={handleRightClick}
        onMouseLeave={handleMouseLeave}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="end"
          position="absolute"
          top={3}
          right={3}
        >
          {actionButton}
        </Box>

        <Grid container>
          <Grid item xs={10}>
            <Box
              display="flex"
              gap={1}
              alignItems="center"
              justifyContent="space-between"
              style={{
                border: `0.5px solid ${theme.palette.text.eventBorder} `,
                borderRadius: "5px",
                padding: "0.1rem 0.2rem",
              }}
            >
              <Typography variant="h6" fontWeight="bolder" noWrap>
                {`${pname} ${psurname}`}
              </Typography>

              {status === "active" && (
                <ReminderStatus status={reminderStatus} />
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Tooltip>
  );
}

export default MonthEvent;
