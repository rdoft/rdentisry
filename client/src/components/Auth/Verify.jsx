import React, { useState, useEffect } from "react";
import { handleError } from "utils";
import { Grid, Typography } from "@mui/material";
import { Button } from "primereact";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

function Verify() {
  const [error, setError] = useState(null);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    AuthService.initVerify({ signal }).catch((error) => {
      const { message } = handleError(error);
      setError(message);
    });
  }, []);

  // SERVICES ---------------------------------------------------------
  const sendMail = async () => {
    setError(null);

    try {
      await AuthService.initVerify();
    } catch (error) {
      const { message } = handleError(error);
      setError(message);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onResend handler
  const handleResend = () => {
    sendMail();
    setResent(true);
  };

  return (
    <Grid container my={10} justifyContent="center" alignItems="center">
      <Grid item sm={9} md={4} lg={3} className="p-fluid">
        <div className="flex mb-7" style={{ justifyContent: "center" }}>
          <Logo style={{ width: "85%" }} />
        </div>

        {error ? (
          <div className="field mb-2">
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </div>
        ) : (
          <div className="flex mb-4" style={{ justifyContent: "center" }}>
            <Typography variant="h4" fontWeight="light">
              Uygulamaya devam etmek için e-posta adresinizi doğrulamanız
              gerekmektedir. Lütfen e-postanıza gönderdiğimiz bağlantı ile
              doğrulama işlemini tamamlayın.
            </Typography>
          </div>
        )}

        <div
          className="flex"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Button
            label="Tekrar Gönder"
            className="p-button-text p-button-secondary"
            onClick={handleResend}
            disabled={resent}
          />
        </div>
      </Grid>
    </Grid>
  );
}

export default Verify;
