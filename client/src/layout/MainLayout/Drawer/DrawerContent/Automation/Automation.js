import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";

// project import
import { MainCard } from "components/Cards";
import { Transitions } from "components/Other";
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
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);

  // Listen for global event to open specific service
  useEffect(() => {
    const handleOpenService = (event) => {
      const { serviceId } = event.detail || {};
      if (serviceId) {
        const service = automationServices.find((s) => s.id === serviceId);
        if (service && !service.disabled) {
          setActiveService(service);
          setOpen(true);
        }
      }
    };

    window.addEventListener("open-automation-service", handleOpenService);
    return () => {
      window.removeEventListener("open-automation-service", handleOpenService);
    };
  }, []);

  // HANDLERS -----------------------------------------------------------------
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    // Reset active service when closing
    if (open) {
      setActiveService(null);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    setActiveService(null);
  };

  // Handler for changing active service
  const handleServiceClick = (service) => {
    if (!service.disabled) {
      setActiveService(service);
    }
  };

  // Handler for back button
  const handleBack = () => {
    setActiveService(null);
  };

  // Render service selection screen
  const renderServicesGrid = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Aşağıdaki Digibot servisleri ile iş akışınızı otomatikleştirebilirsiniz.
      </Typography>

      <Grid container spacing={2}>
        {automationServices.map((service) => (
          <Grid item xs={12} sm={6} key={service.id}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                opacity: service.disabled ? 0.6 : 1,
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  borderColor: service.disabled
                    ? theme.palette.divider
                    : theme.palette.primary.main,
                  bgcolor: service.disabled ? null : "rgba(0, 0, 0, 0.02)",
                },
              }}
            >
              <CardActionArea
                sx={{ height: "100%", p: 1 }}
                onClick={() => handleServiceClick(service)}
                disabled={service.disabled}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <i
                      className={service.icon}
                      style={{
                        fontSize: "24px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: theme.palette.text.secondary,
                        marginRight: "8px",
                      }}
                    ></i>
                    <Typography variant="h6" fontWeight="bold">
                      {service.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                  {service.disabled && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "inline-block",
                        mt: 1,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: "medium",
                      }}
                    >
                      Yakında
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Render active service component
  const renderActiveService = () => {
    const ServiceComponent = activeService.component;

    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <i
            className="fi fi-rr-angle-left"
            style={{
              fontSize: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "8px",
              cursor: "pointer",
            }}
            onClick={handleBack}
          ></i>
          <Typography variant="h6">{activeService.title}</Typography>
        </Box>
        <ServiceComponent onClose={() => setOpen(false)} />
      </Box>
    );
  };

  // Renders the content inside the popper
  const renderContent = () => {
    return activeService ? renderActiveService() : renderServicesGrid();
  };

  return (
    <Box sx={{ flexShrink: 0, px: 1.5, mb: 1 }}>
      <IconButton
        disableRipple
        sx={{
          px: drawerOpen && 1,
          width: drawerOpen ? 1 : 36,
          justifyContent: drawerOpen && "flex-start",
          color: open
            ? theme.palette.text.secondary
            : theme.palette.text.primary,
          bgcolor: open ? theme.palette.background.secondary : null,
          "&:hover": { bgcolor: theme.palette.background.secondary },
        }}
        ref={anchorRef}
        aria-controls={open ? "automation-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
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

        {drawerOpen && (
          <Typography variant="h6" sx={{ px: "10px" }}>
            Digibot
          </Typography>
        )}
      </IconButton>

      <Popper
        placement={matchDownSM ? "top" : "right-start"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal={matchDownSM}
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, matchDownSM ? 0 : 9],
              },
            },
          ],
        }}
        sx={{
          zIndex: theme.zIndex.modal,
          width: matchDownSM ? "100%" : "auto",
          ...(matchDownSM && {
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            px: 1,
            pb: 2,
          }),
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: "100%",
                minWidth: matchDownSM ? "100%" : 480,
                maxWidth: matchDownSM ? "100%" : 480,
                borderRadius: "16px",
                border: `1px solid ${theme.palette.divider}`,
                ...(matchDownSM && {
                  borderRadius: "16px 16px 0 0",
                  py: 1.5,
                }),
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Digibot Servisleri"
                  elevation={0}
                  border={false}
                  content={false}
                  sx={{
                    maxHeight: matchDownSM ? "calc(80vh - 100px)" : 600,
                    overflowY: "auto",
                    bgcolor: "transparent",
                    borderRadius: "inherit",
                    "& .MuiCardHeader-root": {
                      p: matchDownSM ? "12px 16px" : 2,
                    },
                    "& .MuiCardHeader-content": {
                      overflow: "hidden",
                    },
                  }}
                >
                  {renderContent()}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Automation;
