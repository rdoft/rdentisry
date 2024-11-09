import React, { useRef } from "react";
import { Toolbar, Divider, Menu } from "primereact";
import { Typography } from "@mui/material";
import { Add, Delete, More } from "components/Button";
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
  // Get title
  const getTitle = () => {
    return <Typography variant="h3">Hastalar</Typography>;
  };

  // Get Add/More patient buttons
  const actionButton = () => {
    return (
      <>
        {selectedCount > 0 && (
          <>
            <More
              label={`Seçilen Hastalar (${selectedCount})`}
              border
              icon="pi pi-angle-down"
              onClick={(event) => {
                menu.current.toggle(event);
              }}
            />
            <Menu
              model={[
                {
                  label: "SMS İzni Ver",
                  icon: "pi pi-check-circle",
                  style: { fontSize: "0.9rem" },
                  command: () => handleClickPermission({ isSMS: true }),
                },
                {
                  label: "SMS İznini Kaldır",
                  icon: "pi pi-ban",
                  style: { fontSize: "0.9rem" },
                  command: () => handleClickPermission({ isSMS: false }),
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
            />
          </>
        )}
        <SubscriptionController type="patients" onClick={handleClickAdd}>
          <Add label="Hasta Ekle" default />
        </SubscriptionController>
      </>
    );
  };

  // Get search Input
  const searchInput = () => {
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Search onInput={onInput} />
      </div>
    );
  };

  return (
    <>
      <Toolbar
        className="p-2"
        start={getTitle}
        center={searchInput}
        end={actionButton}
        style={{ border: "none" }}
      />
      <Divider className="m-1 p-1" />
    </>
  );
}

export default PatientTableToolbar;
