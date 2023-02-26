import React from "react";
import { InputText } from "primereact";

function Search({ onInput }) {
  // HANDLERS -----------------------------------------------------------------
  // onInput handler
  const handleInput = (event) => {
    onInput(event);
  };

  return (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={handleInput} placeholder="Ara..." />
      </span>
    </div>
  );
}

export default Search;
