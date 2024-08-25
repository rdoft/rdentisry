import React, { useState, useEffect } from "react";
import { handleError } from "utils";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Button } from "primereact";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

function Verified() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    AuthService.completeVerify(token, { signal })
      .then(() => setVerified(true))
      .catch(() => setVerified(false))
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [token]);

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

  // onSuccess handler
  const handleSuccess = () => {
    navigate("/");
  };

  return (
    !loading && (
      <Grid container my={10} justifyContent="center" alignItems="center">
        <Grid item sm={9} md={4} lg={3} className="p-fluid">
          <div className="flex mb-7" style={{ justifyContent: "center" }}>
            <Logo style={{ width: "85%" }} />
          </div>

          {verified ? (
            <>
              <div className="flex mb-4" style={{ justifyContent: "center" }}>
                <Typography variant="h4" fontWeight="light">
                  E-posta adresiniz başarı ile doğrulandı. Şimdi uygulamayı
                  kullanmaya devam edebilirsiniz.
                </Typography>
              </div>

              <Button
                label="Devam"
                className="p-button-primary"
                onClick={handleSuccess}
              />
            </>
          ) : (
            <>
              {error ? (
                <div className="field mb-2">
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </div>
              ) : (
                <div className="flex mb-4" style={{ justifyContent: "center" }}>
                  <Typography variant="h4" fontWeight="light">
                    Hesap aktivasyon bağlantısının süresi doldu. Endişelenmeyin,
                    hemen yeni bir aktivasyon bağlantısı gönderebilirsiniz.
                  </Typography>
                </div>
              )}

              <Button
                label="Tekrar Gönder"
                className="p-button-text p-button-secondary"
                onClick={handleResend}
                disabled={resent}
              />
            </>
          )}
        </Grid>
      </Grid>
    )
  );
}

export default Verified;
