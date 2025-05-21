import React from "react";
import { Button } from "primereact/button";
import { useMediaQuery, useTheme } from "@mui/material";

// assets
import "assets/styles/Button/BaseButton.css";

const BaseButton = ({
  icon,
  label,
  onClick,
  disabled,
  loading,
  variant = "main", // main, outlined, or text
  severity = "primary", // primary, secondary, danger, warning, success
  size = "medium",
  iconPos = "left",
  className,
  style,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sizeStyles = {
    xsmall: {
      padding: isMobile ? "0.4rem 0.8rem" : "0.3rem 0.6rem",
      fontSize: isMobile ? "0.7rem" : "0.65rem",
      height: isMobile ? "1.8rem" : "1.6rem",
      minWidth: isMobile ? "2rem" : "1.6rem",
    },
    small: {
      padding: isMobile ? "0.6rem 1rem" : "0.5rem 0.8rem",
      fontSize: isMobile ? "0.8rem" : "0.75rem",
      height: isMobile ? "2.2rem" : "2rem",
      minWidth: isMobile ? "2.5rem" : "2rem",
    },
    medium: {
      padding: isMobile ? "0.7rem 1.2rem" : "0.6rem 1rem",
      fontSize: isMobile ? "0.9rem" : "0.8rem",
      height: isMobile ? "2.4rem" : "2.2rem",
      minWidth: isMobile ? "3rem" : "2.5rem",
    },
    large: {
      padding: isMobile ? "0.9rem 2rem" : "0.8rem 1.8rem",
      fontSize: isMobile ? "1rem" : "0.9rem",
      height: isMobile ? "2.8rem" : "2.4rem",
      minWidth: isMobile ? "3.5rem" : "3rem",
    },
  };

  const iconOnlyStyles = {
    xsmall: {
      padding: isMobile ? "0.4rem" : "0.3rem",
      height: isMobile ? "1.8rem" : "1.6rem",
      width: isMobile ? "1.8rem" : "1.6rem",
      minWidth: isMobile ? "1.8rem" : "1.6rem",
    },
    small: {
      padding: isMobile ? "0.6rem" : "0.5rem",
      height: isMobile ? "2.2rem" : "2rem",
      width: isMobile ? "2.2rem" : "2rem",
      minWidth: isMobile ? "2.2rem" : "2rem",
    },
    medium: {
      padding: isMobile ? "0.7rem" : "0.6rem",
      height: isMobile ? "2.4rem" : "2.2rem",
      width: isMobile ? "2.4rem" : "2.2rem",
      minWidth: isMobile ? "2.4rem" : "2.2rem",
    },
    large: {
      padding: isMobile ? "0.9rem" : "0.8rem",
      height: isMobile ? "2.8rem" : "2.4rem",
      width: isMobile ? "2.8rem" : "2.4rem",
      minWidth: isMobile ? "2.8rem" : "2.4rem",
    },
  };
  const isIconOnly = !label && icon;

  icon =
    typeof icon === "string" ? (
      <span
        className={icon}
        style={{
          fontSize: sizeStyles[size].fontSize,
          color: style?.iconColor,
        }}
      />
    ) : (
      icon
    );

  return (
    <Button
      icon={icon}
      label={label}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={`${className} base-button base-button-${variant} base-button-${severity} ${
        isIconOnly && "base-button-icon-only"
      }`}
      style={{
        ...(isIconOnly ? iconOnlyStyles[size] : sizeStyles[size]),
        flexDirection: iconPos === "right" ? "row-reverse" : "row",
        ...style,
      }}
      {...props}
    />
  );
};

export default BaseButton;
