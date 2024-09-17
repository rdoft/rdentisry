import React from "react";
import { Toolbar, Divider } from "primereact";
import { Typography } from "@mui/material";
import { Add, Delete } from "components/Button";
import Search from "components/Search";

function ProcedureTableToolbar({
  visibleDelete,
  onClickAdd,
  onClickDelete,
  onInput,
}) {
  // Get title
  const getTitle = () => {
    return <Typography variant="h3">Tedaviler</Typography>;
  };

  // Get Add/Delete procedure buttons
  const getActionButton = () => {
    return (
      <>
        <Delete
          label="Sil"
          onClick={onClickDelete}
          style={{ visibility: visibleDelete ? "visible" : "hidden" }}
        />
        <Add label="Tedavi Ekle" default={true} onClick={onClickAdd} />
      </>
    );
  };

  // Get search Input
  const getSearchInput = () => {
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
        center={getSearchInput}
        end={getActionButton}
        style={{ border: "none" }}
      />
      <Divider className="m-1 p-1" />
    </>
  );
}

export default ProcedureTableToolbar;
