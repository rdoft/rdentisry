import React from "react";
import { Dropdown, Divider } from "primereact";
import DropdownPatientItem from "./DropdownItem/DropdownPatientItem";
import { Add } from "components/Button";

function DropdownPatient({ value, options, onChange, onClickAdd }) {
  const _options = options?.map((option) => {
    return {
      ...option,
      fullName: `${option.name} ${option.surname}`,
    };
  });

  const _value =  value && {
    ...value,
    fullName: `${value.name} ${value.surname}`,
  };
  
  
  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const patientDropdownItem = (option) => {
    return <DropdownPatientItem option={option} />;
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
      value={_value}
      name="patient"
      options={_options}
      optionLabel="name"
      valueTemplate={patientDropdownItem}
      itemTemplate={patientDropdownItem}
      panelFooterTemplate={patientDropdownFooter}
      onChange={onChange}
      className="w-full"
      filter
      filterBy="name,surname,phone,fullName"
      filterLocale="tr-TR"
      placeholder="Hasta seçiniz..."
      emptyMessage="Sonuç bulunamadı"
      emptyFilterMessage="Sonuç bulunamadı"
    />
  );
}

export default DropdownPatient;
