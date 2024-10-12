import React, { useState, useEffect } from "react";
import { handleError } from "utils";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";
import { Button } from "primereact";
import { Loading } from "components/Other";

// services
import { AuthService, ReminderService } from "services";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

function AppointmentConfirmation() {
  const theme = useTheme();
  const { token } = useParams();

  const [error, setError] = useState(null);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    AuthService.controlToken(token, "reminder", { signal })
      .then((res) => {
        setValid(true);
        setAppointment(res.data);
      })
      .catch(() => setValid(false))
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [token]);

  // Set appointment information
  const date = appointment
    ? new Date(appointment.date).toLocaleDateString("tr-TR", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "-";
  const time = appointment
    ? new Date(appointment.startTime).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";
  const doctor = appointment?.doctor?.id
    ? `Dt. ${appointment.doctor.name} ${appointment.doctor.surname}`
    : "-";

  // SERVICES ---------------------------------------------------------
  const saveConfirmation = async (action) => {
    setError(null);
    setLoading(true);

    try {
      await ReminderService.action(token, action);
      setSuccess(true);
    } catch (error) {
      const { message } = handleError(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onClick handlers for action buttons
  const handleApproved = () => saveConfirmation({ action: "approved" });
  const handleUpdated = () => saveConfirmation({ action: "updated" });
  const handleRejected = () => saveConfirmation({ action: "rejected" });

  return loading ? (
    <Loading />
  ) : (
    <Grid container my={10} justifyContent="center" alignItems="center">
      <Grid item xs={10} md={6} lg={4} className="p-fluid">
        <div className="flex mb-7" style={{ justifyContent: "center" }}>
          <Logo style={{ width: "85%" }} />
        </div>

        {!valid ? (
          <Typography variant="h4" fontWeight="light">
            Onay bağlantınız geçersiz, süresi dolmuş veya randevunuz iptal
            edilmiş olabilir. Lütfen kliniğiniz ile iletişime geçin.
          </Typography>
        ) : success ? (
          <Typography variant="h4" fontWeight="light" textAlign="center">
            İşleminiz başarıyla gerçekleştirildi.
          </Typography>
        ) : (
          <>
            <Grid
              container
              p={3}
              sx={{
                borderRadius: "15px",
                backgroundColor: theme.palette.background.primary,
              }}
            >
              {/* Doctor Information */}
              <Grid item xs={6}>
                <Typography variant="caption" color="grey">
                  Doktor
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight="600"
                  color={theme.palette.text.primary}
                >
                  {doctor}
                </Typography>
              </Grid>

              {/* Date and Time Information */}
              <Grid container item xs={6}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="grey">
                    Tarih
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color={theme.palette.text.primary}
                  >
                    {date}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="grey">
                    Saat
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color={theme.palette.text.primary}
                  >
                    {time}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {error && (
              <div className="field mt-2 ml-2">
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </div>
            )}

            {/* Action Buttons */}
            <Grid container spacing={1} justifyContent="space-around" mt={3}>
              <Grid item>
                <Button
                  name="approved"
                  label="Randevuya Geleceğim"
                  size="small"
                  onClick={handleApproved}
                  style={{
                    color: theme.palette.common.white,
                    backgroundColor: theme.palette.text.secondary,
                    borderColor: theme.palette.text.secondary,
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  outlined
                  name="updated"
                  label="Değişiklik Talep Et"
                  size="small"
                  onClick={handleUpdated}
                  style={{
                    color: theme.palette.text.secondary,
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  name="rejected"
                  label="İptal Et"
                  size="small"
                  className="p-button-danger"
                  onClick={handleRejected}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default AppointmentConfirmation;
