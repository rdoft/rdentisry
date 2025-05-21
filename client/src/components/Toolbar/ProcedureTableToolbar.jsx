import React from "react";
import { Toolbar } from "primereact";
import { Box } from "@mui/material";
import { Add, Delete } from "components/Button";
import { SubscriptionController } from "components/Subscription";
import Search from "components/Search";

function ProcedureTableToolbar({
  visibleDelete,
  onClickAdd,
  onClickDelete,
  onInput,
}) {
  // Get search Input
  const startContent = () => {
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", marginLeft: "0.25rem" }}
      >
        <Search onInput={onInput} />
      </Box>
    );
  };

  // Get Add/Delete procedure buttons
  const endContent = () => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Delete
          label="Sil"
          variant="outlined"
          onClick={onClickDelete}
          style={{
            visibility: visibleDelete ? "visible" : "hidden",
          }}
        />
        <SubscriptionController type="storage">
          <Add
            label="Tedavi Ekle"
            onClick={onClickAdd}
          />
        </SubscriptionController>
      </Box>
    );
  };

  return (
    <Toolbar
      className="p-2"
      start={startContent}
      end={endContent}
      style={{
        border: "none",
        padding: "0.5rem 1rem",
        minHeight: "3.25rem",
        backgroundColor: "transparent",
      }}
    />
  );
}

export default ProcedureTableToolbar;
