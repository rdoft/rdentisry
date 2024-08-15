import React, { useState } from "react";
import { Dropdown, Divider } from "primereact";
import { Add } from "components/Button";
import { useLoading } from "context/LoadingProvider";
import { SkeletonDropdown } from "components/Skeleton";
import DropdownPatientItem from "./DropdownItem/DropdownPatientItem";

// assets
import "assets/styles/Other/Dropdown.css";

function DropdownPatient({ value, options, onChange, onClickAdd, ...props }) {
  const { loading } = useLoading();

  const [patient, setPatient] = useState(
    value && {
      ...value,
      fullName: `${value.name} ${value.surname}`,
    }
  );

  const patients = options?.map((option) => {
    return {
      ...option,
      fullName: `${option.name} ${option.surname}`,
    };
  });

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
    setPatient(value);
    onChange(event);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const patientDropdownItem = (option) => {
    return loading.patients ? (
      <SkeletonDropdown />
    ) : (
      <DropdownPatientItem option={option} />
    );
  };

  // Dropdown panel footer
  const patientDropdownFooter = () => {
    return (
      onClickAdd && (
        <div className="m-2">
          <Divider className="mt-0 mb-2" />
          <Add label="Hasta Ekle" onClick={onClickAdd} />
        </div>
      )
    );
  };

  return (
    <Dropdown
      value={patient}
      name="patient"
      options={patients}
      optionLabel="name"
      valueTemplate={patientDropdownItem}
      itemTemplate={patientDropdownItem}
      panelFooterTemplate={patientDropdownFooter}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      className="w-full"
      style={props?.style}
      filter
      filterBy="name,surname,phone,fullName"
      filterLocale="tr-TR"
      placeholder="Hasta seçiniz..."
      emptyMessage="Sonuç bulunamadı"
      emptyFilterMessage="Sonuç bulunamadı"
      disabled={props.disabled}
    />
  );
}

export default DropdownPatient;
