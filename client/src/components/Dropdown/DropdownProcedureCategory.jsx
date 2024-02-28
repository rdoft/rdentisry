import React from "react";
import { Dropdown, Button, Divider } from "primereact";
import DropdownProcedureCategoryItem from "./DropdownItem/DropdownProcedureCategoryItem";

function DropdownProcedureCategory({ value, options, onChange, onClickAdd }) {
  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const procedureCategoryDropdownItem = (option) => {
    return <DropdownProcedureCategoryItem option={option} />;
  };

  // Dropdown panel footer
  const procedureCategoryDropdownFooter = () => {
    return (
      onClickAdd && (
        <div className="m-2">
          <Divider className="mt-0 mb-2" />
          <Button
            label="Kategori Ekle"
            icon="pi pi-cog"
            className="p-button-text p-button-secondary"
            size="small"
            onClick={onClickAdd}
          />
        </div>
      )
    );
  };

  return (
    <Dropdown
      value={value}
      name="procedureCategory"
      options={options}
      optionLabel="title"
      itemTemplate={procedureCategoryDropdownItem}
      valueTemplate={procedureCategoryDropdownItem}
      panelFooterTemplate={procedureCategoryDropdownFooter}
      onChange={onChange}
      placeholder="Kategori seçiniz..."
    />
  );
}

export default DropdownProcedureCategory;
