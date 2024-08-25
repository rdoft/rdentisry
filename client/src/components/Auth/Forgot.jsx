import React, { useState } from "react";
import { handleError } from "utils";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { InputText, Button } from "primereact";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

function Forgot() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // SERVICES ---------------------------------------------------------
  const sendMail = async (auth) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.forgot(auth);
      setSuccess(true);
    } catch (error) {
      const { message } = handleError(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onForgot handler
  const handleForgot = () => {
    sendMail({
      email,
    });
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
      sendMail();
    }
  };

  return (
    <Grid container my={10} justifyContent="center" alignItems="center">
      <Grid item sm={9} md={4} lg={3} className="p-fluid">
        <div className="flex mb-7" style={{ justifyContent: "center" }}>
          <Logo style={{ width: "85%" }} />
        </div>

        {success ? (
          <div className="flex mb-2" style={{ justifyContent: "center" }}>
            <Typography variant="h4" fontWeight="light">
              Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen
              e-postanızı kontrol ediniz.
            </Typography>
          </div>
        ) : (
          <>
            <div className="field mb-4">
              <Typography variant="h2" fontWeight="light">
                Şifre yenile
              </Typography>
            </div>

            {/* Error message */}
            {error ? (
              <div className="field mb-2">
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </div>
            ) : (
              <div className="field mb-2">
                <Typography variant="body2">
                  Hesabınızın e-posta adresini girin, size şifre sıfırlamak için
                  bir bağlantı göndereceğiz.
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

            <div className="field mb-3">
              {loading ? (
                <Button
                  label=<i className="pi pi-spin pi-spinner" />
                  disabled
                />
              ) : (
                <Button
                  label="Gönder"
                  onClick={handleForgot}
                  disabled={!isValid}
                />
              )}
            </div>
          </>
        )}

        <div
          className="flex"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Button
            label="Oturum aç"
            onClick={() => navigate("/login")}
            className="p-button-text p-button-secondary"
          />
        </div>
      </Grid>
    </Grid>
  );
}

export default Forgot;
