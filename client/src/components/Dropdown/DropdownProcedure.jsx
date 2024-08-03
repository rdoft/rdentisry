import React from "react";
import { Dropdown, Divider, Button } from "primereact";
import DropdownProcedureItem from "./DropdownItem/DropdownProcedureItem";

// assets
import "assets/styles/Other/Dropdown.css";

function DropdownProcedure({ value, options, onChange, onClickOptions }) {
  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const procedureDropdownItem = (option) => {
    return <DropdownProcedureItem option={option} />;
  };

  // Dropdown value template
  const procedureDropdownValue = (option) => {
    return <DropdownProcedureItem option={option} isValue={true} />;
  };

  // Dropdown panel footer
  const procedureDropdownFooter = () => {
    return (
      onClickOptions && (
        <div className="m-2">
          <Divider className="mt-0 mb-2" />
          <Button
            label="Tedavi Ayarları"
            icon="pi pi-cog"
            className="p-button-text p-button-secondary"
            size="small"
            onClick={onClickOptions}
          />
        </div>
      )
    );
  };

  return (
    <Dropdown
      value={value}
      name="procedure"
      options={options}
      optionLabel="name"
      valueTemplate={procedureDropdownValue}
      itemTemplate={procedureDropdownItem}
      panelFooterTemplate={procedureDropdownFooter}
      onChange={onChange}
      scrollHeight="300px"
      filter
      filterBy="name,code,procedureCategory.title"
      filterLocale="tr-TR"
      placeholder="Tedavi seçiniz..."
      emptyMessage="Sonuç bulunamadı"
      emptyFilterMessage="Sonuç bulunamadı"
    />
  );
}

export default DropdownProcedure;
