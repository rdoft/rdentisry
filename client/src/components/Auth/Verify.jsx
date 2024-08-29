import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "utils";
import { Grid, Typography } from "@mui/material";
import { Button } from "primereact";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

// services
import { AuthService, UserService } from "services";

const MAX_LIMIT = 30; // Limit the number of checks
const INTERVAL = 10000; // 10 seconds interval

function Verify() {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let count = 0;

    const checkVerification = async () => {
      try {
        const res = await UserService.getUser({ signal });

        if (res.data.verified) {
          navigate("/");
        } else {
          setEmail(res.data.email);
          await sendMail({ email: res.data.email });
        }
      } catch (error) {
        const { message } = handleError(error);
        setError(message);
      }
    };
    checkVerification();

    const intervalId = setInterval(async () => {
      try {
        count += 1;
        const res = await UserService.getUser({ signal });

        if (res.data.verified) {
          clearInterval(intervalId);
          navigate("/");
        } else if (count >= MAX_LIMIT) {
          clearInterval(intervalId);
        }
      } catch (error) {
        const { message } = handleError(error);
        setError(message);
      }
    }, INTERVAL);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [navigate]);

  // SERVICES ---------------------------------------------------------
  const sendMail = async (auth) => {
    setError(null);

    try {
      await AuthService.initVerify(auth);
    } catch (error) {
      const { message } = handleError(error);
      setError(message);
    }
  };

  // HANDLERS ---------------------------------------------------------
  // onResend handler
  const handleResend = () => {
    sendMail({ email });
    setResent(true);
  };

  return (
    <Grid container my={10} justifyContent="center" alignItems="center">
      <Grid item sm={9} md={4} lg={3} className="p-fluid">
        <div className="flex mb-7" style={{ justifyContent: "center" }}>
          <Logo style={{ width: "85%" }} />
        </div>

        {error ? (
          <div className="field mb-2">
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </div>
        ) : (
          <div className="flex mb-4" style={{ justifyContent: "center" }}>
            <Typography variant="h4" fontWeight="light">
              Uygulamaya devam etmek için e-posta adresinizi doğrulamanız
              gerekmektedir. Lütfen e-postanıza gönderdiğimiz bağlantı ile
              doğrulama işlemini tamamlayın.
            </Typography>
          </div>
        )}

        <div
          className="flex"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Button
            label="Tekrar Gönder"
            className="p-button-text p-button-secondary"
            onClick={handleResend}
            disabled={resent}
          />
        </div>
      </Grid>
    </Grid>
  );
}

export default Verify;
