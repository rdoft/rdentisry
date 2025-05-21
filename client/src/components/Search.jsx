import React from "react";
import { InputText } from "primereact";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function Search({ onInput, style }) {
  const theme = useTheme();

  // HANDLERS -----------------------------------------------------------------
  // onInput handler
  const handleInput = (event) => {
    onInput(event);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "16rem",
        height: "2.25rem",
      }}
    >
      <InputText
        type="search"
        onInput={handleInput}
        placeholder="Ara..."
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "30px",
          paddingLeft: "1rem",
          paddingRight: "3rem",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: "4px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: theme.palette.text.secondary,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          color: theme.palette.common.white,
        }}
      >
        <i className="pi pi-search" style={{ fontSize: "0.9rem" }} />
      </Box>
    </Box>
  );
}

export default Search;
