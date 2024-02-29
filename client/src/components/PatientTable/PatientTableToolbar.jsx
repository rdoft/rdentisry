import React from "react";
import { Toolbar } from "primereact";
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
  // Get Add/Delete patient buttons
  const actionButton = () => {
    return (
      <>
        <Add label="Hasta Ekle" default={true} onClick={handleClickAdd} />
        <Delete
          label="Sil"
          onClick={onClickDelete}
          style={{ visibility: visibleDelete ? "visible" : "hidden" }}
        />
      </>
    );
  };

  // Get search Input
  const searchInput = () => {
    return <Search onInput={onInput} />;
  };

  return (
    <Toolbar className="mb-4 p-2" start={actionButton} end={searchInput} />
  );
}

export default PatientTableToolbar;
