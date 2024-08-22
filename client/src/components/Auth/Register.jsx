import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "utils";
import { Grid, Typography } from "@mui/material";
import { InputText, Button, Password, Divider } from "primereact";

// assets
import svgGoogle from "assets/svg/google.svg";
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

function Register() {
  const navigate = useNavigate();

  const GOOGLE_AUTH = process.env.REACT_APP_AUTH_URL
    ? `${process.env.REACT_APP_AUTH_URL}google`
    : "https://localhost:8080/auth/google";

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  // SERVICES ---------------------------------------------------------
  const register = async (auth) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.register(auth);
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
    window.location.href = GOOGLE_AUTH;
  };

  // Register handler
  const handleRegister = () => {
    register({
      name: user.name,
      email: user.email,
      password: user.password,
    });
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      event.stopPropagation();
      handleRegister();
    }
  };

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
            feedback={false}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
          {isError.password && (
            <small id="password-help" className="p-error">
              Parola en az 8 karakterden oluşmalıdır
            </small>
          )}
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
