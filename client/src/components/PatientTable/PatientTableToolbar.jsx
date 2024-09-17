import React from "react";
import { Toolbar, Divider } from "primereact";
import { Typography } from "@mui/material";
import { Add, Delete } from "components/Button";
import Search from "components/Search";

function PatientTableToolbar({
  visibleDelete,
  onClickAdd,
  onClickDelete,
  onInput,
}) {
  // HANDLERS ------------------------------------------------------------------
  // onClickAdd handler
  const handleClickAdd = () => {
    onClickAdd();
  };

  // TEMPLATES ------------------------------------------------------------------
  // Get title
  const getTitle = () => {
    return <Typography variant="h3">Hastalar</Typography>;
  };

  // Get Add/Delete patient buttons
  const actionButton = () => {
    return (
      <>
        <Delete
          label="Sil"
          onClick={onClickDelete}
          style={{ visibility: visibleDelete ? "visible" : "hidden" }}
        />
        <Add label="Hasta Ekle" default={true} onClick={handleClickAdd} />
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
