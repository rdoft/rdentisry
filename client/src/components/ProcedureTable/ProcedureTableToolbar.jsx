import React from "react";
import { Toolbar } from "primereact";
import { Add, Delete } from "components/Button";
import Search from "components/Search";

function ProcedureTableToolbar({
  visibleDelete,
  onClickAdd,
  onClickDelete,
  onInput,
}) {
  // Get Add/Delete procedure buttons
  const getActionButton = () => {
    return (
      <>
        <Add label="Tedavi Ekle" default={true} onClick={onClickAdd} />
        <Delete
          label="Sil"
          onClick={onClickDelete}
          style={{ visibility: visibleDelete ? "visible" : "hidden" }}
        />
      </>
    );
  };

  // Get search Input
  const getSearchInput = () => {
    return <Search onInput={onInput} />;
  };

  return (
    <Toolbar
      className="mb-4 p-2"
      start={getActionButton}
      end={getSearchInput}
    />
  );
}

export default ProcedureTableToolbar;
