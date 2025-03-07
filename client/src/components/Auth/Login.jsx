import React, { useState } from "react";
import { handleError } from "utils";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { InputText, Button, Password } from "primereact";
import { useAuth } from "context/AuthProvider";
import { useSubscription } from "context/SubscriptionProvider";

// assets
import svgGoogle from "assets/svg/google.svg";
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

function Login() {
  const navigate = useNavigate();
  const { authenticate } = useAuth();
  const { refresh } = useSubscription();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const GOOGLE_AUTH = `${process.env.REACT_APP_AUTH_URL}google`;

  const [auth, setAuth] = useState({
    email: document.getElementById("email")?.value || "",
    password: document.getElementById("password")?.value || "",
  });
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // SERVICES ---------------------------------------------------------
  const login = async (auth) => {
    setLoading(true);
    setError(null);

    try {
      const res = await AuthService.login(auth);

      // Set isAuthenticated for all routes
      authenticate(res.data);
      refresh();
      res.data.verified ? navigate("/") : navigate("/verify");
    } catch (error) {
      const { status, message } = handleError(error);
      status === 401 ? setError("Email veya şifre hatalı") : setError(message);
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    // auth
    const _auth = {
      ...auth,
      [event.target.name]: event.target.value,
    };

    // validation
    const _isValid = schema.login.validate(_auth).error ? false : true;

    setAuth(_auth);
    setIsValid(_isValid);
    setError(null);
  };

  // Login with google
  const handleLoginGoogle = () => {
    window.location.href = GOOGLE_AUTH;
  };

  // Login handler
  const handleLogin = () => {
    login(auth);
  };

  // handle to navigate register page
  const handleRegister = () => {
    navigate("/register");
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      event.stopPropagation();
      handleLogin();
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
              Giriş yap
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                color: theme.palette.grey[600],
              }}
            >
              Hesabınıza erişmek için giriş yapın
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Button
              className="flex p-button-outlined p-button-secondary"
              style={{
                justifyContent: "center",
                height: "48px",
                fontSize: "16px",
                width: "100%",
                marginBottom: "12px",
                borderRadius: "8px",
              }}
              onClick={handleLoginGoogle}
            >
              <img src={svgGoogle} alt="Google" style={{ width: "22px" }} />
              <span className="px-2">Google ile devam et</span>
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography
              variant="caption"
              sx={{
                px: 2,
                color: theme.palette.grey[600],
                fontSize: "14px",
              }}
            >
              veya
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
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
              Email
            </Typography>
            <InputText
              id="email"
              name="email"
              type="email"
              placeholder="mail@example.com"
              keyfilter="email"
              value={auth.email}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Şifre
              </Typography>
              <Link
                to="/forgot"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "14px",
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Şifremi unuttum
                </Typography>
              </Link>
            </Box>
            <Password
              id="password"
              name="password"
              placeholder="••••••••"
              value={auth.password}
              toggleMask
              feedback={false}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              inputStyle={{
                fontSize: "16px",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                width: "calc(100% - 2.5rem)",
              }}
              style={{ width: "100%" }}
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
                label="Devam"
                onClick={handleLogin}
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
              Hesabınız yok mu?
            </Typography>
            <Button
              label="Hesap oluştur"
              onClick={handleRegister}
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

export default Login;
