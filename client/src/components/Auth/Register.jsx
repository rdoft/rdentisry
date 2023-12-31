import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Validation of form fields
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const _isValid = !schema.register.validate({ name, email, password }).error;
    _isValid && password === confirmPassword
      ? setIsValid(true)
      : setIsValid(false);
  }, [name, email, password, confirmPassword]);

  // SERVICES ---------------------------------------------------------
  const register = async (auth) => {
    try {
      await AuthService.register(auth);
      navigate("/");
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    const value = (event.target && event.target.value) || "";
    const _isError = { ...isError };

    if (attr === "name") {
      // Set name
      setName(value);
    } else if (attr === "email") {
      // Set email
      schema.email.validate(value).error
        ? (_isError.email = true)
        : (_isError.email = false);
      setEmail(value);
    } else if (attr === "password") {
      // Set password
      schema.password.validate(value).error
        ? (_isError.password = true)
        : (_isError.password = false);
      setPassword(value);
    } else {
      // Set confirm password
      _isError.confirmPassword = value !== password ? true : false;
      setConfirmPassword(value);
    }

    setIsError(_isError);
  };

  // Register handler
  const handleRegister = () => {
    register({ name, email, password });
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item lg={2}>
        <Card className="p-fluid">
          <div className="flex mb-5" style={{ justifyContent: "center" }}>
            <img src={logo} alt="Logo" style={{ width: "85%" }} />
          </div>

          <div className="field mb-3">
            <Typography variant="h3">Hesap oluştur</Typography>
          </div>

          <div className="field mb-3">
            <InputText
              id="name"
              type="text"
              placeholder="Kullanıcı adı"
              value={name}
              onChange={(e) => handleChange(e, "name")}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="field mb-3">
            <InputText
              id="email"
              type="email"
              placeholder="Email *"
              keyfilter="email"
              value={email}
              onChange={(e) => handleChange(e, "email")}
              onKeyDown={handleKeyDown}
              required
            />
            {isError.email && (
              <small id="email-help" className="p-error">
                Geçersiz email adresi
              </small>
            )}
          </div>

          <div className="field mb-2">
            <Password
              id="password"
              placeholder="Parola *"
              value={password}
              toggleMask
              feedback={false}
              onChange={(e) => handleChange(e, "password")}
              onKeyDown={handleKeyDown}
              required
            />
            {isError.password && (
              <small id="password-help" className="p-error">
                Parola en az 8 karakterden oluşmalıdır
              </small>
            )}
          </div>

          <div className="field mb-3">
            <Password
              id="confirm-password"
              placeholder="Parola (Tekrar) *"
              value={confirmPassword}
              toggleMask
              feedback={false}
              onChange={(e) => handleChange(e, "confirmPassword")}
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

          <div className="field mb-3">
            <Button
              label="Kayıt Ol"
              onClick={handleRegister}
              disabled={!isValid}
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
