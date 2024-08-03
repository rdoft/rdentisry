import React from "react";
import { Dropdown } from "primereact";
import DropdownToothItem from "./DropdownItem/DropdownToothItem";

// assets
import "assets/styles/Other/Dropdown.css";

function DropdownTooth({ options, onChange, ...props }) {
  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const toothDropdownItem = (option) => {
    return <DropdownToothItem option={option} />;
  };

  return (
    <Dropdown
      name="teeth"
      options={options}
      optionLabel="label"
      optionGroupLabel="label"
      optionGroupChildren="items"
      filter
      filterBy="label"
      emptyMessage="Sonuç bulunamadı"
      emptyFilterMessage="Sonuç bulunamadı"
      placeholder="Seç"
      itemTemplate={toothDropdownItem}
      onChange={onChange}
      style={{ ...props.style }}
    />
  );
}

export default DropdownTooth;
