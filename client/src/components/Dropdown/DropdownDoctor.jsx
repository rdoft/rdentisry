import React from "react";
import { Dropdown, Divider } from "primereact";
import { Add } from "components/Button";
import DropdownDoctorItem from "./DropdownItem/DropdownDoctorItem";

function DropdownDoctor({
  value,
  options,
  onChange,
  onClickAdd,
  onClickDelete,
  ...props
}) {
  const _options = options?.map((option) => {
    return {
      ...option,
      fullName: `${option.name} ${option.surname}`,
    };
  });

  const _value = value && {
    ...value,
    fullName: `${value.name} ${value.surname}`,
  };

  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const doctorDropdownItem = (option) => {
    return <DropdownDoctorItem option={option} onDelete={onClickDelete} />;
  };

  // Dropdown value template
  const doctorDropdownValue = (option) => {
    return <DropdownDoctorItem option={option} />;
  };

  // Dropdown panel footer
  const doctorDropdownFooter = () => {
    return (
      <div className="m-2">
        <Divider className="mt-0 mb-2" />
        <Add label="Doktor Ekle" onClick={onClickAdd} />
      </div>
    );
  };

  return (
    <Dropdown
      value={_value}
      name="doctor"
      options={_options}
      optionLabel="name"
      valueTemplate={doctorDropdownValue}
      itemTemplate={doctorDropdownItem}
      panelFooterTemplate={doctorDropdownFooter}
      onChange={onChange}
      className={props?.className}
      style={props?.style}
      filter
      filterBy="name,surname,fullName"
      filterLocale="tr-TR"
      placeholder="Doktor seçiniz..."
      emptyMessage="Sonuç bulunamadı"
      emptyFilterMessage="Sonuç bulunamadı"
      showClear
    />
  );
}

export default DropdownDoctor;
