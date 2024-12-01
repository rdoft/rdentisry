import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleError } from "utils";
import { Grid, Typography } from "@mui/material";
import { InputText, Button, Password, Divider } from "primereact";
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
      action: "REGISTER_GOOGLE"
    });
    window.location.href = referralCode
      ? `${GOOGLE_AUTH}?referralCode=${referralCode}`
      : GOOGLE_AUTH;
  };

  // Register handler
  const handleRegister = () => {
    ReactGA.event({
      category: "User",
      action: "REGISTER"
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
        <li>8 veya daha fazla karakter</li>
        <li>Büyük ve küçük harf</li>
        <li>En az bir rakam</li>
      </ul>
    </>
  );

  return (
    <Grid container my={10} justifyContent="center" alignItems="center">
      <Grid item sm={9} md={4} lg={3} className="p-fluid">
        <div className="flex mb-7" style={{ justifyContent: "center" }}>
          <Logo style={{ width: "85%" }} />
        </div>

        <div className="field mb-4">
          <Typography variant="h2" fontWeight="light">
            Hesap oluştur
          </Typography>
        </div>

        {error && (
          <div className="field mb-2">
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </div>
        )}

        <div className="field mb-3">
          <InputText
            id="name"
            name="name"
            type="text"
            placeholder="Kullanıcı adı"
            value={user.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="field mb-3">
          <InputText
            id="email"
            name="email"
            type="email"
            placeholder="Email *"
            keyfilter="email"
            value={user.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
          {isError.email && (
            <small id="email-help" className="p-error">
              Geçersiz email adresi
            </small>
          )}
        </div>

        <div className="field mb-3">
          <Password
            id="password"
            name="password"
            placeholder="Parola *"
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
            {...(isError.password && { className: "p-invalid" })}
          />
        </div>

        <div className="field mb-4">
          <Password
            id="confirm-password"
            name="confirmPassword"
            placeholder="Parola (Tekrar) *"
            value={user.confirmPassword}
            toggleMask
            feedback={false}
            onChange={handleChange}
            onPaste={(e) => e.preventDefault()}
            onKeyDown={handleKeyDown}
            required
            maxLength={20}
            {...(isError.confirmPassword && { className: "p-invalid" })}
          />
          {isError.confirmPassword && (
            <small id="repassword-help" className="p-error">
              Parolalar eşleşmiyor
            </small>
          )}
        </div>

        <div className="field mb-4">
          {loading ? (
            <Button label=<i className="pi pi-spin pi-spinner" /> disabled />
          ) : (
            <Button
              label="Kayıt Ol"
              onClick={handleRegister}
              disabled={!isValid}
            />
          )}
        </div>

        <div className="field mb-3" align="center">
          <Typography variant="caption">veya</Typography>
        </div>

        <div className="field mb-4">
          <Button
            className="flex p-text p-button-outlined p-button-secondary"
            style={{ justifyContent: "center" }}
            onClick={handleRegisterGoogle}
          >
            <img src={svgGoogle} alt="Google" style={{ width: "25px" }} />
            <span className="px-3">Google ile devam et</span>
          </Button>
        </div>

        <Divider className="field mt-5" />

        <div
          className="flex mb-4"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div className="mr-3">
            <Typography variant="body1">Zaten bir hesabınız var mı?</Typography>
          </div>
          <div>
            <Button
              label="Oturum aç"
              onClick={() => navigate("/login")}
              className="p-button-text p-button-secondary"
            />
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default Register;
