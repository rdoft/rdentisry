import React, { useEffect, useState } from "react";
import { handleError } from "utils";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Grid } from "@mui/material";
import { Password, Button } from "primereact";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService } from "services";

import schema from "schemas/user.schema";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

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

    AuthService.control(token, { signal }).catch(() => {
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
      toast.success("Şifreniz başarıyla yenilendi");
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

  return (
    <Grid container my={10} justifyContent="center" alignItems="center">
      <Grid item sm={9} md={4} lg={3} className="p-fluid">
        <div className="flex mb-7" style={{ justifyContent: "center" }}>
          <Logo style={{ width: "40%" }} />
        </div>

        <div className="field mb-4">
          <Typography variant="h2" fontWeight="light">
            Şifre yenileme
          </Typography>
        </div>

        {/* Error message */}
        {error && (
          <div className="field mb-2">
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </div>
        )}

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
            <Button label="Devam" onClick={handleReset} disabled={!isValid} />
          )}
        </div>
      </Grid>
    </Grid>
  );
}

export default ResetPassword;
