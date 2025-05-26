import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function PatientCard({ patient }) {
  const theme = useTheme();

  const getInitials = (name, surname) => {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "0.5rem",
      }}
    >
      <Avatar
        sx={{
          bgcolor: theme.palette.background.secondary,
          color: theme.palette.text.secondary,
          width: 36,
          height: 36,
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        {getInitials(patient?.name, patient?.surname)}
      </Avatar>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          {patient?.name} {patient?.surname}
        </Typography>
      </Box>
    </Box>
  );
}

export default PatientCard;
