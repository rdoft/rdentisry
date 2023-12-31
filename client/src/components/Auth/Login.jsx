import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { Grid, Typography } from "@mui/material";
import { InputText, Button, Password, Divider, Card } from "primereact";

// assets
import logo from "assets/images/logo.png";
import { ReactComponent as Rdoft } from "assets/svg/rdoft.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

export default function Login() {
  const navigate = useNavigate();

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
      error.response?.status === 401
        ? toast.error("Kullanıcı adı veya parola hatalı")
        : toast.error(toastErrorMessage(error));
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
      <Grid item md={4} lg={2}>
        <Card className="p-fluid">
          <div className="flex mb-5" style={{ justifyContent: "center" }}>
            <img src={logo} alt="Logo" style={{ width: "85%" }} />
          </div>

          <div className="field mb-3">
            <Typography variant="h3">Oturum aç</Typography>
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

          <div className="field mb-2">
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

          <div className="field mb-3">
            <label htmlFor="reset-password">
              <Link to="/reset-password" style={{ textDecoration: "none" }}>
                <Typography variant="body1">
                  Parolanızı mı unuttunuz?
                </Typography>
              </Link>
            </label>
          </div>

          <div className="field mb-3">
            <Button label="Devam" onClick={handleLogin} disabled={!isValid} />
          </div>

          <div className="field mb-5">
            <Button
              label="Hesap oluştur"
              onClick={handleRegister}
              className="p-button-text p-button-secondary"
            />
          </div>

          <Divider />

          <div className="flex m-2" style={{ justifyContent: "center" }}>
            <Rdoft />
          </div>
        </Card>
      </Grid>
    </Grid>
  );
}
