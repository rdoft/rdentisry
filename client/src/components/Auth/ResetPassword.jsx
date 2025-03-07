import React, { useEffect, useState } from "react";
import { handleError } from "utils";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { Password, Button } from "primereact";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
    token: token,
  });

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    AuthService.controlToken(token, "reset", { signal }).catch(() => {
      navigate("/login");
    });

    return () => {
      controller.abort();
    };
  }, [token, navigate]);

  // SERVICES ---------------------------------------------------------
  const reset = async (auth) => {
    setLoading(true);

    try {
      await AuthService.reset(token, auth);
      toast.success("Parolanız başarıyla yenilendi");
      navigate("/login");
    } catch (error) {
      const { message } = handleError(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onReset handler
  const handleReset = () => {
    reset({
      password: user.password,
    });
  };

  // onChange handler
  const handleChange = (event) => {
    const { name, value } = event.target;

    // user
    const _user = {
      ...user,
      [name]: value,
    };

    // error
    const _isError = { ...isError };
    switch (name) {
      case "password":
        schema.password.validate(_user.password).error
          ? (_isError.password = true)
          : (_isError.password = false);

        _isError.confirmPassword =
          _user.confirmPassword !== _user.password ? true : false;
        break;
      case "confirmPassword":
        _isError.confirmPassword =
          _user.confirmPassword !== _user.password ? true : false;
        break;
      default:
        break;
    }

    // validation
    const _isValid =
      !schema.password.validate(_user.password).error &&
      _user.password === _user.confirmPassword
        ? true
        : false;

    setUser(_user);
    setIsError(_isError);
    setIsValid(_isValid);
    setError(null);
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleReset();
    }
  };

  // TEMPLATES -------------------------------------------------------
  const passwordFooter = (
    <>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>En az 8 karakter</li>
        <li>En az bir büyük harf ve bir küçük harf</li>
        <li>En az bir rakam</li>
      </ul>
    </>
  );

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
              Şifre yenileme
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                color: theme.palette.grey[600],
              }}
            >
              Lütfen yeni şifrenizi belirleyin
            </Typography>
          </Box>

          {/* Error message */}
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

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontSize: "15px",
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              Yeni şifre
            </Typography>
            <Password
              id="password"
              name="password"
              placeholder="••••••••"
              value={user.password}
              toggleMask
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              maxLength={20}
              weakLabel="Zayıf"
              mediumLabel="Orta"
              strongLabel="Güçlü"
              promptLabel="Parolanız şunları içermelidir:"
              footer={passwordFooter}
              inputStyle={{
                fontSize: "16px",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                width: "calc(100% - 2.5rem)",
              }}
              style={{ width: "100%" }}
              {...(isError.password && { className: "p-invalid" })}
            />
          </Box>

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
              Şifre (Tekrar)
            </Typography>
            <Password
              id="confirm-password"
              name="confirmPassword"
              placeholder="••••••••"
              value={user.confirmPassword}
              toggleMask
              feedback={false}
              onChange={handleChange}
              onPaste={(e) => e.preventDefault()}
              onKeyDown={handleKeyDown}
              required
              maxLength={20}
              inputStyle={{
                fontSize: "16px",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                width: "calc(100% - 2.5rem)",
              }}
              style={{ width: "100%" }}
              {...(isError.confirmPassword && { className: "p-invalid" })}
            />
            {isError.confirmPassword && (
              <Typography
                variant="caption"
                color="error"
                sx={{ fontSize: "14px", mt: 0.5, display: "block" }}
              >
                Parolalar eşleşmiyor
              </Typography>
            )}
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
                label="Devam"
                onClick={handleReset}
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
              onClick={() => navigate("/login")}
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

export default ResetPassword;
