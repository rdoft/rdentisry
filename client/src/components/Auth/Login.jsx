import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { errorHandler } from "utils";
import { Grid, Typography } from "@mui/material";
import { InputText, Button, Password, Divider } from "primereact";

// assets
import svgGoogle from "assets/svg/google.svg";
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

export default function Login() {
  const navigate = useNavigate();
  const GOOGLE_AUTH = process.env.REACT_APP_AUTH_URL
    ? `${process.env.REACT_APP_AUTH_URL}google`
    : "https://localhost:8080/auth/google";

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
      await AuthService.login(auth);
      navigate("/");
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401
        ? setError("Kullanıcı adı veya parola hatalı")
        : setError(message);
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
      handleLogin();
    }
  };

  return (
    <Grid container my={10} justifyContent="center" alignItems="center">
      <Grid item sm={9} md={4} lg={3} className="p-fluid">
        <div className="flex mb-7" style={{ justifyContent: "center" }}>
          <Logo style={{ width: "40%" }} />
        </div>

        <div className="flex mb-4">
          <Typography variant="h2" fontWeight="light">
            Oturum aç
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
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            keyfilter="email"
            value={auth.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
        </div>

        <div className="field mb-2">
          <Password
            id="password"
            name="password"
            placeholder="Parola"
            value={auth.password}
            toggleMask
            feedback={false}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
        </div>

        <div className="flex mb-4" style={{ justifyContent: "end" }}>
          <label htmlFor="reset-password">
            <Link
              to="/forgot"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Typography variant="body1">Şifrenizi mi unuttunuz?</Typography>
            </Link>
          </label>
        </div>

        <div className="field mb-3">
          {loading ? (
            <Button label=<i className="pi pi-spin pi-spinner" /> disabled />
          ) : (
            <Button label="Devam" onClick={handleLogin} disabled={!isValid} />
          )}
        </div>

        <div className="field mb-3" align="center">
          <Typography variant="caption">veya</Typography>
        </div>

        <div className="field mb-4">
          <Button
            className="flex p-text p-button-outlined p-button-secondary"
            style={{ justifyContent: "center" }}
            onClick={handleLoginGoogle}
          >
            <img src={svgGoogle} alt="Google" style={{ width: "25px" }} />
            <span className="px-3">Google ile devam et</span>
          </Button>
        </div>

        <Divider className="field mt-5" />

        <div
          className="flex"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div className="mr-3">
            <Typography variant="body1">Hesabınız yok mu? </Typography>
          </div>
          <div>
            <Button
              label="Hesap oluştur"
              onClick={handleRegister}
              className="p-button-text p-button-secondary"
            />
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
