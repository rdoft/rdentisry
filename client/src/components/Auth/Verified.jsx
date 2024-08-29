import React, { useState, useEffect } from "react";
import { handleError } from "utils";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { InputText, Button } from "primereact";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

// schemas
import schema from "schemas/user.schema";

function Verified() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
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
  const sendMail = async (auth) => {
    setError(null);

    try {
      await AuthService.initVerify(auth);
    } catch (error) {
      const { message } = handleError(error);
      setError(message);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onSuccess handler
  const handleSuccess = () => {
    navigate("/");
  };

  // onResend handler
  const handleResend = () => {
    sendMail({ email });
    setResent(true);
  };

  // onChange handler
  const handleChange = (event) => {
    setEmail(event.target.value);
    if (schema.email.validate(event.target.value).error) {
      setError("Geçersiz email adresi");
      setIsValid(false);
    } else {
      setError(null);
      setIsValid(true);
    }
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      sendMail({ email });
    }
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
              <div className="flex mb-2" style={{ justifyContent: "center" }}>
                <Typography variant="h4" fontWeight="light">
                  Hesap aktivasyon bağlantısının süresi doldu. Endişelenmeyin,
                  hemen yeni bir aktivasyon bağlantısı gönderebilirsiniz.
                </Typography>
              </div>

              {error && (
                <div className="field mb-2">
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </div>
              )}

              {/* Email */}
              <div className="field mb-3">
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email *"
                  keyfilter="email"
                  value={email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                />
              </div>

              <Button
                label="Tekrar Gönder"
                className="p-button-text p-button-secondary"
                onClick={handleResend}
                disabled={resent || !isValid}
              />
            </>
          )}
        </Grid>
      </Grid>
    )
  );
}

export default Verified;
