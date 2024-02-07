import React from "react";
import { Toolbar, Button } from "primereact";
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
      <React.Fragment>
        <Button
          label="Tedavi Ekle"
          icon="pi pi-plus"
          size="small"
          className="p-button-info mr-2"
          onClick={onClickAdd}
        />
        <Button
          label="Sil"
          icon="pi pi-trash"
          size="small"
          className="p-button-text p-button-danger"
          onClick={onClickDelete}
          visible={visibleDelete}
        />
      </React.Fragment>
    );
  };

  // Get search Input
  const getSearchInput = () => {
    return <Search onInput={onInput} />;
  };

  return (
    <Toolbar
      className="mb-4 p-2"
      left={getActionButton}
      right={getSearchInput}
    />
  );
}

export default ProcedureTableToolbar;