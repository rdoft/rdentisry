import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { Divider, InputText } from "primereact";
import { Grid, Box, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { LoadingController } from "components/Loadable";
import { Loading } from "components/Other";
import { Prev, Subscribe } from "components/Button";
import SubscriptionToolbar from "./SubscriptionToolbar";
import PricingCard from "./PricingCard";
import CheckoutForm from "./CheckoutForm";

// services
import { SubscriptionService } from "services";

// schemas
import schema from "schemas/subscription.schema";

function Checkout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { pricing, userDetail, saveUserDetail } = useSubscription();

  const PRIVACY = "https://www.disheki.me/privacy-policy";
  const TERMS = "https://www.disheki.me/terms-of-service";

  // Set the default values
  const [isValid, setIsValid] = useState();
  const [isError, setIsError] = useState({
    idNumber: false,
    name: false,
    surname: false,
    phone: false,
    address: false,
    city: false,
    country: false,
  });
  const [checkoutForm, setCheckoutForm] = useState("");

  useEffect(() => {
    const _isValid = schema.billing.validate(userDetail).error ? false : true;
    setIsValid(_isValid);
  }, [userDetail]);

  // SERVICES -----------------------------------------------------------------
  // Init checkout proccess and redirect to the payment page

  const checkout = async () => {
    startLoading("save");
    try {
      const response = await SubscriptionService.checkout({
        pricingId: pricing.id,
        ...userDetail,
      });

      if (response?.data?.checkoutForm) {
        // Adjust and redirect to the payment page
        setCheckoutForm(response.data.checkoutForm);
      } else {
        toast.error("Ödeme sayfasına yönlendirilemedi. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS ---------------------------------------------------------------------------------------------------------
  // onClick handler for Back button
  const handleClickBack = () => {
    navigate("/pricing");
  };

  // onClick handler for Submit
  const handleSubmit = () => {
    isValid && checkout();
  };

  // onChange handler for user
  const handleChange = (event) => {
    const { name, value } = event.target;

    // user
    const _user = {
      ...userDetail,
      [name]: value,
    };

    // error
    const _isError = {
      ...isError,
      [name]: schema[name].validate(value).error ? true : false,
    };

    // validation
    const _isValid = schema.billing.validate(_user).error ? false : true;

    // Set isError and user
    saveUserDetail(_user);
    setIsError(_isError);
    setIsValid(_isValid);
  };

  // TODO: handle toolbar and design
  return !pricing ? (
    <Navigate to="/pricing" />
  ) : (
    <Grid
      container
      item
      rowSpacing={4.5}
      columnSpacing={2.75}
      justifyContent="space-around"
    >
      <Grid item xs={12}>
        {/* Toolbar */}
        <SubscriptionToolbar index={2} />
      </Grid>

      {/* Pricing Card */}
      <Grid
        container
        item
        xs={10}
        sm={10}
        md={5}
        sx={{
          alignItems: "start",
          justifyContent: "center",
          borderRadius: "8px",
          padding: 4,
          backgroundColor: theme.palette.background.primary,
        }}
      >
        {/* Back */}
        <Grid item xs={12} pb={2}>
          <Prev label={"Geri"} onClick={handleClickBack} />
        </Grid>
        {/* Card */}
        <Grid item xs={9}>
          <PricingCard pricing={pricing} selected />
        </Grid>
        {/* Privacy */}
        <Grid item xs={12} mt={2}>
          <Typography variant="body1" align="center">
            <Link
              href={PRIVACY}
              style={{
                color: theme.palette.grey[500],
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Gizlilik
            </Link>{" "}
            <Typography
              variant="h4"
              component="span"
              sx={{
                color: theme.palette.grey[500],
                padding: "0 0.5rem",
                fontWeight: "lighter",
              }}
            >
              |
            </Typography>{" "}
            <Link
              href={TERMS}
              style={{
                color: theme.palette.grey[500],
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Kullanıcı Sözleşmesi
            </Link>
          </Typography>
        </Grid>
      </Grid>

      {/* Checkout */}
      <Grid
        container
        item
        xs={10}
        sm={10}
        md={6}
        sx={{
          alignItems: "start",
          justifyContent: "center",
          backgroundColor: theme.palette.common.white,
          borderRadius: "8px",
          padding: 4,
        }}
      >
        <LoadingController name="Checkout" skeleton={<Loading />}>
          {checkoutForm ? (
            <Grid item xs={12}>
              <CheckoutForm content={checkoutForm} />
            </Grid>
          ) : (
            <Grid
              container
              item
              sm={12}
              md={9}
              alignItems="start"
              justifyContent="center"
            >
              {/* Header */}
              <Typography variant="h3" fontWeight="light">
                Fatura Bilgileri
              </Typography>

              <Divider className="m-1 py-3" />

              <Grid container rowSpacing={2}>
                {/* TC */}
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight="bold" mb={0.5}>
                    Kimlik <small className="p-error">*</small>
                  </Typography>
                  <InputText
                    id="idNumber"
                    name="idNumber"
                    value={userDetail.idNumber || ""}
                    onChange={handleChange}
                    keyfilter="num"
                    placeholder="TC Kimlik Numarası"
                    maxLength={11}
                    style={{ width: "100%" }}
                    autoFocus
                    required
                    {...(isError.idNumber && { className: "p-invalid" })}
                  />
                </Grid>

                {/* Name - Surname */}
                <Grid item xs={12} sm={6} pr={1}>
                  <InputText
                    id="name"
                    name="name"
                    type="text"
                    value={userDetail.name || ""}
                    placeholder="Ad"
                    onChange={handleChange}
                    style={{ width: "100%" }}
                    required
                    {...(isError.name && { className: "p-invalid" })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} pl={1}>
                  <InputText
                    id="surname"
                    name="surname"
                    type="text"
                    value={userDetail.surname || ""}
                    placeholder="Soyad"
                    onChange={handleChange}
                    style={{ width: "100%" }}
                    required
                    {...(isError.surname && { className: "p-invalid" })}
                  />
                </Grid>

                {/* Phone */}
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight="bold" mb={0.5}>
                    Telefon <small className="p-error">*</small>
                  </Typography>
                  <InputText
                    id="phone"
                    name="phone"
                    value={userDetail.phone || ""}
                    keyfilter="num"
                    placeholder="5xxxxxxxxx"
                    maxLength={10}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                    required
                    {...(isError.phone && { className: "p-invalid" })}
                  />
                </Grid>

                {/* Adress */}
                <Grid item xs={12} justifyContent="space-between">
                  <Typography variant="body2" fontWeight="bold" mb={0.5}>
                    Adres <small className="p-error">*</small>
                  </Typography>

                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <InputText
                      id="city"
                      name="city"
                      value={userDetail.city || ""}
                      type="text"
                      placeholder="Şehir"
                      onChange={handleChange}
                      style={{ width: "48%" }}
                      required
                      {...(isError.city && { className: "p-invalid" })}
                    />
                    <InputText
                      id="country"
                      name="country"
                      value={userDetail.country || ""}
                      type="text"
                      style={{ width: "48%" }}
                      disabled
                    />
                  </Box>
                  <InputText
                    id="address"
                    name="address"
                    value={userDetail.address || ""}
                    type="text"
                    placeholder="Adres"
                    onChange={handleChange}
                    style={{ width: "100%" }}
                    required
                    {...(isError.address && { className: "p-invalid" })}
                  />
                </Grid>

                {/* Submit */}
                <Grid item xs={12} mt={3}>
                  <Subscribe
                    label={"Şimdi Öde"}
                    onClick={handleSubmit}
                    disabled={!isValid}
                    style={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.text.secondary,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.grey[600],
                    }}
                  >
                    {new Date().toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    tarihinden itibaren aylık ₺
                    {pricing.price.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}{" "}
                    ücretlendirileceksiniz. Bir sonraki ödeme tarihinizden önce
                    aboneliğinizi iptal edebilirsiniz.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </LoadingController>
      </Grid>
    </Grid>
  );
}

export default Checkout;
