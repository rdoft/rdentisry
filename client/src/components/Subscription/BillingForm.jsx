import React, { useEffect, useState } from "react";
import { Divider, InputText } from "primereact";
import { Grid, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSubscription } from "context/SubscriptionProvider";
import { Subscribe } from "components/Button";
// schemas
import schema from "schemas/subscription.schema";

function BillingForm({ onSubmit }) {
  const theme = useTheme();
  const { userDetail, saveUserDetail } = useSubscription();

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

  useEffect(() => {
    const _isValid = schema.billing.validate(userDetail).error ? false : true;
    setIsValid(_isValid);
  }, [userDetail]);

  // HANDLERS ---------------------------------------------------------------------------------------------------------
  // onClick handler for Submit
  const handleSubmit = () => {
    isValid && onSubmit();
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

  return (
    <Grid container alignItems="start" justifyContent="center">
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
      </Grid>
    </Grid>
  );
}

export default BillingForm;
