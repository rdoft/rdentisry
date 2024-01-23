import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import { Grid, Typography } from "@mui/material";
import { InputText, Button, Password, Divider, Card } from "primereact";

// assets
import svgGoogle from "assets/svg/google.svg";
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";
import { ReactComponent as Rdoft } from "assets/svg/rdoft/rdoft.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

export default function Login() {
  const navigate = useNavigate();
  const GOOGLE_AUTH = process.env.REACT_APP_AUTH_URL
    ? `${process.env.REACT_APP_AUTH_URL}google`
    : "https://localhost:8080/auth/google";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Validation of form fields
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const _isValid = !schema.login.validate({ email, password }).error;

    setIsValid(_isValid);
  }, [email, password]);

  // SERVICES ---------------------------------------------------------
  const login = async (auth) => {
    try {
      await AuthService.login(auth);
      navigate("/");
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401
        ? toast.error("Kullanıcı adı veya parola hatalı")
        : toast.error(message);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    const value = (event.target && event.target.value) || "";

    if (attr === "email") {
      // Set email
      setEmail(value);
    } else {
      // Set password
      setPassword(value);
    }
  };

  // Login with google
  const handleLoginGoogle = () => {
    window.location.href = GOOGLE_AUTH;
  };

  // Login handler
  const handleLogin = () => {
    login({ email, password });
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

        <div className="field mb-4">
          <Typography variant="h2">Oturum aç</Typography>
        </div>

        <div className="field mb-3">
          <InputText
            id="email"
            type="email"
            placeholder="Email"
            keyfilter="email"
            value={email}
            onChange={(e) => handleChange(e, "email")}
            onKeyDown={handleKeyDown}
            required
          />
        </div>

        <div className="field mb-4">
          <Password
            id="password"
            placeholder="Parola"
            value={password}
            toggleMask
            feedback={false}
            onChange={(e) => handleChange(e, "password")}
            onKeyDown={handleKeyDown}
            required
          />
        </div>

        {/* <div className="field mb-3">
            <label htmlFor="reset-password">
              <Link to="/reset-password" style={{ textDecoration: "none" }}>
                <Typography variant="body1">
                  Parolanızı mı unuttunuz?
                </Typography>
              </Link>
            </label>
          </div> */}

        <div className="field mb-3">
          <Button label="Devam" onClick={handleLogin} disabled={!isValid} />
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
