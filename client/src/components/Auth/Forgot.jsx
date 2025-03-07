import React, { useState } from "react";
import { handleError } from "utils";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { InputText, Button } from "primereact";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

function Forgot() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // SERVICES ---------------------------------------------------------
  const forgot = async (email) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.forgot({ email });
      setSuccess(true);
    } catch (error) {
      const { status, message } = handleError(error);
      status === 404
        ? setError("Bu email adresi ile kayıtlı bir hesap bulunamadı")
        : setError(message);
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    // validation
    const _isValid = schema.forgot.validate({ email: event.target.value }).error
      ? false
      : true;

    setEmail(event.target.value);
    setIsValid(_isValid);
    setError(null);
  };

  // Forgot handler
  const handleForgot = () => {
    forgot(email);
  };

  // handle to navigate login page
  const handleLogin = () => {
    navigate("/login");
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      event.stopPropagation();
      handleForgot();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 5 },
        backgroundColor: theme.palette.background.primary,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: { xs: 4, sm: 5 },
        }}
      >
        <Logo
          style={{
            width: isMobile ? "80%" : "100%",
            maxWidth: isMobile ? "240px" : "280px",
          }}
        />
      </Box>

      <Card
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "450px" },
          boxShadow: theme.shadows[3],
          borderRadius: "16px",
          overflow: "visible",
          backgroundColor: theme.palette.common.white,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              fontWeight="500"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem" },
                lineHeight: 1.2,
                mb: 1,
                color: theme.palette.text.primary,
              }}
            >
              Şifremi unuttum
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                color: theme.palette.grey[600],
              }}
            >
              Şifrenizi sıfırlamak için email adresinizi girin
            </Typography>
          </Box>

          {error && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: theme.palette.background.error,
                borderRadius: "8px",
                border: `1px solid ${theme.palette.text.error}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: "15px", color: theme.palette.text.error }}
              >
                {error}
              </Typography>
            </Box>
          )}

          {success ? (
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: theme.palette.background.success,
                borderRadius: "8px",
                border: `1px solid ${theme.palette.text.success}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: "15px", color: theme.palette.text.success }}
              >
                Şifre sıfırlama bağlantısı email adresinize gönderildi
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontSize: "15px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
                  Email
                </Typography>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mail@example.com"
                  keyfilter="email"
                  value={email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                  style={{
                    fontSize: "16px",
                    padding: "0.75rem 1rem",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                {loading ? (
                  <Button
                    label=<i className="pi pi-spin pi-spinner" />
                    disabled
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <Button
                    label="Gönder"
                    onClick={handleForgot}
                    disabled={!isValid}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </Box>
            </>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: "15px", color: theme.palette.grey[600] }}
            >
              Giriş sayfasına dön
            </Typography>
            <Button
              label="Giriş yap"
              onClick={handleLogin}
              className="p-button-text p-button-secondary"
              style={{
                fontSize: "15px",
                padding: "0.25rem 0.5rem",
                height: "auto",
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Forgot;
