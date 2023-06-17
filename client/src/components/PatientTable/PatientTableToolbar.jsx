import React from "react";
import { Toolbar, Button } from "primereact";
import Search from "./Search";

function PatientTableToolbar({ visibleDelete, onClickAdd, onClickDelete, onInput }) {
  // Get Add/Delete patient buttons
  const getActionButton = () => {
    return (
      <React.Fragment>
        <Button
          label="Hasta Ekle"
          icon="pi pi-plus"
          className="p-button-text p-button-info mr-2"
          onClick={onClickAdd}
        />
        <Button
          label="Sil"
          icon="pi pi-trash"
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
    <Toolbar className="mb-4 p-2" left={getActionButton} right={getSearchInput} />
  );
}

export default PatientTableToolbar;
