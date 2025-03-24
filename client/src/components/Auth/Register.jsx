import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleError } from "utils";
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
import ReactGA from "react-ga4";

// assets
import svgGoogle from "assets/svg/google.svg";
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticate } = useAuth();
  const { refresh } = useSubscription();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const GOOGLE_AUTH = `${process.env.REACT_APP_AUTH_URL}google`;

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [referralCode, setReferralCode] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Initialize referral code from query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referralCode = params.get("ref");
    if (referralCode) {
      setReferralCode(referralCode);
    }
  }, [location.search]);

  // SERVICES ---------------------------------------------------------
  const register = async (auth) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.register(auth);
      authenticate({ agreement: false });
      refresh();
      navigate("/");
    } catch (error) {
      const { message } = handleError(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    // user
    const _user = {
      ...user,
      [event.target.name]: event.target.value,
    };

    // error
    const _isError = { ...isError };
    switch (event.target.name) {
      case "email":
        schema.email.validate(_user.email).error
          ? (_isError.email = true)
          : (_isError.email = false);
        break;
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
      !schema.register.validate({
        name: _user.name,
        email: _user.email,
        password: _user.password,
      }).error && _user.password === _user.confirmPassword
        ? true
        : false;

    setUser(_user);
    setIsError(_isError);
    setIsValid(_isValid);
    setError(null);
  };

  // Register with google
  const handleRegisterGoogle = () => {
    ReactGA.event({
      category: "User",
      action: "REGISTER_GOOGLE",
    });
    window.location.href = referralCode
      ? `${GOOGLE_AUTH}?referralCode=${referralCode}`
      : GOOGLE_AUTH;
  };

  // Register handler
  const handleRegister = () => {
    ReactGA.event({
      category: "User",
      action: "REGISTER",
    });
    register({
      name: user.name,
      email: user.email,
      password: user.password,
      referralCode: referralCode,
    });
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      event.stopPropagation();
      handleRegister();
    }
  };

  // TEMPLATES  ---------------------------------------------------------
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
              Hesap oluştur
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                color: theme.palette.grey[600],
              }}
            >
              Yeni bir hesap oluşturun
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
              onClick={handleRegisterGoogle}
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
              Klinik/Doktor Adı
            </Typography>
            <InputText
              id="name"
              name="name"
              type="text"
              placeholder="Klinik/Doktor Adı"
              value={user.name}
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
              value={user.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              style={{
                fontSize: "16px",
                padding: "0.75rem 1rem",
                width: "100%",
                borderRadius: "8px",
              }}
              className={isError.email ? "p-invalid" : ""}
            />
            {isError.email && (
              <Typography
                variant="caption"
                color="error"
                sx={{ fontSize: "14px", mt: 0.5, display: "block" }}
              >
                Geçersiz email adresi
              </Typography>
            )}
          </Box>

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
              Şifre
            </Typography>
            <Password
              id="password"
              name="password"
              value={user.password}
              toggleMask
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              maxLength={20}
              weakLabel="Zayıf"
              mediumLabel="Orta"
              strongLabel="Güçlü"
              promptLabel="Şifreniz şunları içermelidir:"
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
                Şifreler eşleşmiyor
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
                onClick={handleRegister}
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
              Zaten hesabınız var mı?
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

export default Register;
