import React, { useState } from "react";
import { Dropdown, Button, Divider } from "primereact";
import DropdownProcedureCategoryItem from "./DropdownItem/DropdownProcedureCategoryItem";

// assets
import "assets/styles/Other/Dropdown.css";

function DropdownProcedureCategory({
  value,
  options,
  onChange,
  onClickAdd,
  ...props
}) {
  const [procedureCategory, setProcedureCategory] = useState(value);
  const procedureCategories = options;

  // HANDLERS ------------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    const { value } = event.target;
    const procedureCategory_ = procedureCategories.find(
      (procedureCategory) => procedureCategory.id === value
    );
    setProcedureCategory(procedureCategory_);
    onChange(procedureCategory_);
  };

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
      value={procedureCategory?.id}
      name="procedureCategory"
      options={procedureCategories}
      optionValue="id"
      optionLabel="title"
      itemTemplate={procedureCategoryDropdownItem}
      valueTemplate={procedureCategoryDropdownItem}
      panelFooterTemplate={procedureCategoryDropdownFooter}
      onChange={handleChange}
      style={props?.style}
      placeholder="Kategori seçiniz..."
    />
  );
}

export default DropdownProcedureCategory;
