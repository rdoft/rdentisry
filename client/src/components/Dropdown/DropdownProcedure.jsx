import React, { useState } from "react";
import { Dropdown, Divider, Button } from "primereact";
import { useLoading } from "context/LoadingProvider";
import { SkeletonDropdown } from "components/Skeleton";
import DropdownProcedureItem from "./DropdownItem/DropdownProcedureItem";

// assets
import "assets/styles/Other/Dropdown.css";

function DropdownProcedure({
  value,
  options,
  onChange,
  onClickOptions,
  ...props
}) {
  const { loading } = useLoading();

  const [procedure, setProcedure] = useState(value);

  // HANDLERS ------------------------------------------------------------------
  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.stopPropagation();
    }
  };

  // onChange handler
  const handleChange = (event) => {
    const { value } = event.target;
    const procedure_ = options.find((procedure) => procedure.id === value);
    setProcedure(procedure_);
    onChange(procedure_);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const procedureDropdownItem = (option) => {
    return <DropdownProcedureItem option={option} />;
  };

  // Dropdown value template
  const procedureDropdownValue = (option) => {
    return loading.procedures ? (
      <SkeletonDropdown />
    ) : (
      <DropdownProcedureItem option={option} isValue={true} />
    );
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
      value={procedure?.id}
      name="procedure"
      options={options}
      optionValue="id"
      optionLabel="id"
      valueTemplate={procedureDropdownValue}
      itemTemplate={procedureDropdownItem}
      panelFooterTemplate={procedureDropdownFooter}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      scrollHeight="300px"
      style={props?.style}
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
