import React, { useState } from "react";
import { Password, Divider } from "primereact";
import { DialogTemp } from "components/Dialog";

// schema
import schema from "schemas/user.schema";

function ResetPassword({ onSubmit, onHide }) {
  const [user, setUser] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
    password: false,
    confirmPassword: false,
  });

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    const { name, value } = event.target;

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
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit({ oldPassword: user.oldPassword, password: user.password });
  };

  // TEMPLATES -------------------------------------------------------
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
    <DialogTemp
      isValid={isValid}
      onHide={handleHide}
      onSubmit={handleSubmit}
      header="Şifre Yenileme"
      style={{ height: "fit-content" }}
    >
      <Divider type="solid" className="mt-0" />

      <div className="field mb-3">
        <Password
          id="oldPassword"
          name="oldPassword"
          placeholder="Eski Parola *"
          value={user.oldPassword}
          toggleMask
          onChange={handleChange}
          required
          maxLength={20}
          feedback={false}
        />
      </div>

      <div className="flex">
        <div className="field mr-2">
          <Password
            id="password"
            name="password"
            placeholder="Parola *"
            value={user.password}
            toggleMask
            onChange={handleChange}
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

        <div className="field ml-2">
          <Password
            id="confirm-password"
            name="confirmPassword"
            placeholder="Parola (Tekrar) *"
            value={user.confirmPassword}
            toggleMask
            feedback={false}
            onChange={handleChange}
            onPaste={(e) => e.preventDefault()}
            required
            maxLength={20}
            {...(isError.confirmPassword && { className: "p-invalid" })}
          />
          <small
            id="repassword-help"
            className="p-error"
            style={{
              visibility: isError.confirmPassword ? "visible" : "hidden",
            }}
          >
            Parolalar eşleşmiyor
          </small>
        </div>
      </div>
    </DialogTemp>
  );
}

export default ResetPassword;
