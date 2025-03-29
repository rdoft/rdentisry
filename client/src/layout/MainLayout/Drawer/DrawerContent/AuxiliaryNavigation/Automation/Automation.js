import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// project import
import { AutomationDialog } from "components/Dialog";
import AppointmentReminderTab from "./AppointmentReminderTab";
import PaymentReminderTab from "./PaymentReminderTab";

// ==============================|| DRAWER CONTENT - AUTOMATION ||============================== //

// Available automation services
const automationServices = [
  {
    id: "appointment-reminder",
    title: "Randevu Hatırlatma (SMS)",
    description: "Hastlarınıza yaklaşan randevularını hatırlatın ve onay alın",
    icon: "fi fi-rr-calendar-clock",
    component: AppointmentReminderTab,
  },
  {
    id: "payment-reminder",
    title: "Ödeme Hatırlatma (SMS)",
    description: "Hastalarınıza gecikmiş ödemeleri hatırlatın",
    icon: "fi fi-rr-comment-dollar",
    component: PaymentReminderTab,
    disabled: true,
  },
];

const Automation = () => {
  const theme = useTheme();
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const [open, setOpen] = useState(false);
  const [initialServiceId, setInitialServiceId] = useState(null);

  // Listen for global event to open specific service
  useEffect(() => {
    const handleOpenService = (event) => {
      const { serviceId } = event.detail || {};
      if (serviceId) {
        setInitialServiceId(serviceId);
        setOpen(true);
      }
    };

    window.addEventListener("open-automation-service", handleOpenService);
    return () => {
      window.removeEventListener("open-automation-service", handleOpenService);
    };
  }, []);

  // HANDLERS -----------------------------------------------------------------
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInitialServiceId(null);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? 3 : 1.5,
          py: !drawerOpen ? 1.25 : 1,
          ...(drawerOpen && {
            "&:hover": {
              bgcolor: theme.palette.background.secondary,
              borderRadius: "10px",
            },
          }),
          ...(!drawerOpen && {
            "&:hover": {
              bgcolor: "transparent",
            },
          }),
          ...(open && {
            bgcolor: theme.palette.background.secondary,
            ...(drawerOpen && {
              borderRadius: "10px",
            }),
            color: theme.palette.text.secondary,
          }),
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: open
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                bgcolor: "secondary.lighter",
              },
            }),
          }}
        >
          <i
            className="fi fi-rr-message-bot"
            style={{
              fontSize: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></i>
        </ListItemIcon>

        {drawerOpen && (
          <ListItemText
            primary={
              <Typography
                variant="h6"
                sx={{
                  color: open
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary,
                  paddingLeft: "10px",
                }}
              >
                Digibot
              </Typography>
            }
          />
        )}
      </ListItemButton>

      {/* Using the separate AutomationDialog component with services passed as prop */}
      <AutomationDialog
        open={open}
        onClose={handleClose}
        services={automationServices}
        initialServiceId={initialServiceId}
      />
    </>
  );
};

export default Automation;
