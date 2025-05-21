import React, { useRef } from "react";
import { Toolbar, Menu } from "primereact";
import { Box } from "@mui/material";
import { Add, Delete, More, Basic } from "components/Button";
import { SubscriptionController } from "components/Subscription";
import Search from "components/Search";

function PatientTableToolbar({
  selectedCount,
  onClickAdd,
  onClickDelete,
  onClickPermission,
  onInput,
}) {
  const menu = useRef(null);

  // HANDLERS ------------------------------------------------------------------
  // onClickAdd handler
  const handleClickAdd = () => {
    onClickAdd();
  };

  // onClickPermission handler
  const handleClickPermission = (permission) => {
    onClickPermission(permission);
  };

  // TEMPLATES ------------------------------------------------------------------
  // Get search Input
  const startContent = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginLeft: "0.25rem",
        }}
      >
        <Search onInput={onInput} />
      </Box>
    );
  };

  // Get Add/More patient buttons
  const endContent = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {selectedCount > 0 && (
          <>
            <More
              label={`Seçilen Hastalar (${selectedCount})`}
              icon="pi pi-angle-down"
              onClick={(event) => {
                menu.current.toggle(event);
              }}
            />
            <Menu
              model={[
                {
                  template: () => (
                    <Basic
                      label="SMS İzni Ver"
                      icon="pi pi-check-circle"
                      onClick={() => handleClickPermission({ isSMS: true })}
                    />
                  ),
                },
                {
                  template: () => (
                    <Basic
                      label="SMS İzni Kaldır"
                      icon="pi pi-ban"
                      onClick={() => handleClickPermission({ isSMS: false })}
                    />
                  ),
                },
                {
                  template: () => (
                    <Delete
                      label="Sil"
                      style={{
                        width: "100%",
                        textAlign: "start",
                      }}
                      onClick={onClickDelete}
                    />
                  ),
                },
              ]}
              ref={menu}
              id="popup_menu"
              popup
              style={{
                padding: "0.25rem",
              }}
            />
          </>
        )}
        <SubscriptionController type="patients">
          <Add label="Hasta Ekle" onClick={handleClickAdd} />
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

export default PatientTableToolbar;
