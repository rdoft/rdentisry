import React from "react";
import { Dropdown, Divider } from "primereact";
import DropdownPatientItem from "./DropdownItem/DropdownPatientItem";
import ActionGroup from "components/ActionGroup/ActionGroup";

function DropdownPatient({ value, options, onChange, onClickAdd }) {
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
          <ActionGroup label="Hasta Ekle" onClickAdd={onClickAdd} />
        </div>
      )
    );
  };

  return (
    <React.Fragment>
      <Dropdown
        value={value}
        options={options}
        optionLabel="name"
        valueTemplate={patientDropdownItem}
        itemTemplate={patientDropdownItem}
        panelFooterTemplate={patientDropdownFooter}
        onChange={onChange}
        className="w-full"
        filter
        filterBy="name,surname,phone"
        placeholder="Hasta seçiniz..."
        emptyMessage="Sonuç bulunamadı"
        emptyFilterMessage="Sonuç bulunamadı"
      />
    </React.Fragment>
  );
}

export default DropdownPatient;
