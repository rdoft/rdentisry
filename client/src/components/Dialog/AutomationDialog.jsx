import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function AutomationDialog({
  open,
  onClose,
  services = [],
  initialServiceId = null,
}) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Initialize active service if initialServiceId is provided
  const [activeService, setActiveService] = useState(() => {
    if (initialServiceId) {
      return (
        services.find((s) => s.id === initialServiceId && !s.disabled) || null
      );
    }
    return null;
  });

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
        {services.map((service) => (
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
            px: matchDownSM ? 1 : 2,
            pt: 1,
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
        <ServiceComponent onClose={onClose} />
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxHeight: "90vh",
        },
      }}
      sx={{
        zIndex: theme.zIndex.dialog || 1400,
      }}
    >
      <DialogTitle
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Digibot Servisleri</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          <i
            className="fi fi-rr-cross-small"
            style={{
              fontSize: "16px",
            }}
          ></i>
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          "&:first-of-type": {
            pt: 0,
          },
          maxHeight: matchDownSM ? "calc(80vh - 80px)" : "550px",
          overflowY: "auto",
        }}
      >
        {activeService ? renderActiveService() : renderServicesGrid()}
      </DialogContent>
    </Dialog>
  );
}

export default AutomationDialog;
