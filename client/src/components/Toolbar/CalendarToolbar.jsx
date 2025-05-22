import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Grid, Typography, Box, useMediaQuery, Divider } from "@mui/material";
import { Next, Prev, Today, SelectButton } from "components/Button";
import { DoctorDialog } from "components/Dialog";
import { DropdownDoctor } from "components/Dropdown";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";

// assets
import { useTheme } from "@mui/material/styles";

// services
import { DoctorService } from "services";

const CalendarToolbar = ({
  label,
  view,
  views,
  onNavigate,
  onView,
  doctor,
  doctors,
  setDoctor,
  setDoctors,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { startLoading, stopLoading } = useLoading();
  const { refresh } = useSubscription();

  const [doctorDialog, setDoctorDialog] = useState(false);

  // Get doctors on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("doctors");
    DoctorService.getDoctors({ signal })
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((error) => {})
      .finally(() => stopLoading("doctors"));

    return () => {
      controller.abort();
    };
  }, [setDoctors, startLoading, stopLoading]);

  // Filter views and set the default view
  views = views.filter((view) => (isMobile ? view === "day" : view !== "day"));
  useEffect(() => {
    if (!views.includes(view)) {
      onView(views[0]);
    }
  }, [views, view, onView]);

  const options = views.map((item) => {
    switch (item) {
      case "month":
        return {
          value: item,
          label: "Ay",
        };
      case "week":
        return {
          value: item,
          label: "Hafta",
        };
      case "day":
        return {
          value: item,
          label: "Gün",
        };
      default:
        return {
          value: item,
          label: item,
        };
    }
  });

  // SERVICES -----------------------------------------------------------------
  // Get the list of doctors and set doctors value
  const getDoctors = async () => {
    let response;

    try {
      startLoading("doctors");
      response = await DoctorService.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      // pass
    } finally {
      stopLoading("doctors");
    }
  };

  // Save doctor (create)
  const saveDoctor = async (doctor) => {
    let response;

    try {
      startLoading("save");
      response = await DoctorService.saveDoctor(doctor);
      doctor = response.data;

      // Get and set the updated list of doctors
      await getDoctors();
      setDoctorDialog(false);
      setDoctor(doctor);
      refresh();
      localStorage.setItem("doctor", JSON.stringify(doctor));
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // Delete the doctor
  const deleteDoctor = async (doctor) => {
    try {
      startLoading("delete");
      await DoctorService.deleteDoctor(doctor.id);

      // Get and set the updated list of doctors
      await getDoctors();
      setDoctor(null);
      refresh();
      localStorage.removeItem("doctor");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // Navigate to previous date
  const handleNavigate = (action) => {
    onNavigate(action);
  };

  // Change the view
  const handleView = (event) => {
    onView(event.value);
  };

  // onChange handler for doctor dropdown
  const handleChangeDoctor = (doctor) => {
    setDoctor(doctor);
    doctor
      ? localStorage.setItem("doctor", JSON.stringify(doctor))
      : localStorage.removeItem("doctor");
  };

  // Show add doctor dialog
  const showDoctorDialog = () => {
    setDoctorDialog(true);
  };

  // Hide add doctor dialog
  const hideDoctorDialog = () => {
    setDoctorDialog(false);
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        spacing={1}
        py={1}
        justifyContent="space-between"
      >
        <Grid item xs={6} sm={3} md={4} order={{ xs: 1, sm: 0 }}>
          <Typography
            variant={isMobile ? "h5" : "h3"}
            fontWeight="bolder"
            sx={{ color: theme.palette.text.primary }}
          >
            {label}
          </Typography>
        </Grid>

        <Grid
          item
          xs={6}
          sm={4}
          md={4}
          order={{ xs: 2, sm: 1 }}
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-end", sm: "center" },
            alignItems: "center",
          }}
        >
          {options.length > 1 && (
            <>
              <SelectButton
                value={view}
                onChange={handleView}
                options={options}
              />
              <Divider
                orientation="vertical"
                sx={{
                  mx: 1,
                  height: "24px",
                  alignSelf: "center",
                  border: `0.5px solid ${theme.palette.grey[300]}`,
                }}
              />
            </>
          )}
          <Box display="flex" gap={0.4}>
            <Today onClick={() => handleNavigate("TODAY")} />
            <Prev onClick={() => handleNavigate("PREV")} />
            <Next onClick={() => handleNavigate("NEXT")} />
          </Box>
        </Grid>

        {/* Doctor selection at the end */}
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          order={{ xs: 0, sm: 2 }}
          sx={{
            display: "flex",
            justifyContent: { md: "flex-end", sm: "center" },
          }}
        >
          <DropdownDoctor
            key={doctor?.id}
            value={doctor}
            options={doctors}
            onChange={handleChangeDoctor}
            onClickAdd={showDoctorDialog}
            onClickDelete={deleteDoctor}
            style={{
              alignItems: "center",
              height: isMobile ? "2.5rem" : "2.2rem",
              width: isMobile ? "100%" : "18rem",
              backgroundColor: "transparent",
              border: `1px solid ${theme.palette.divider}`,
              "&:focus": {
                border: `1px solid ${theme.palette.text.secondary}`,
              },
            }}
          />
        </Grid>
      </Grid>

      {doctorDialog && (
        <DoctorDialog onHide={hideDoctorDialog} onSubmit={saveDoctor} />
      )}
    </>
  );
};

export default CalendarToolbar;
