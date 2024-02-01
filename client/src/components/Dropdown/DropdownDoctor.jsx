import React from "react";
import { Dropdown, Divider } from "primereact";
import DropdownDoctorItem from "components/Dropdown/DropdownItem/DropdownDoctorItem";
import ActionGroup from "components/ActionGroup/ActionGroup";

function DropdownDoctor({
  value,
  options,
  onChange,
  onClickAdd,
  onClickDelete,
}) {
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
        <ActionGroup label="Doktor Ekle" onClickAdd={onClickAdd} />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Dropdown
        value={value}
        options={options}
        optionLabel="name"
        valueTemplate={doctorDropdownValue}
        itemTemplate={doctorDropdownItem}
        panelFooterTemplate={doctorDropdownFooter}
        onChange={onChange}
        className={value ? "w-full" : "w-full p-2"}
        filter
        filterBy="name,surname"
        placeholder="Doktor seçiniz..."
        emptyMessage="Sonuç bulunamadı"
        emptyFilterMessage="Sonuç bulunamadı"
        showClear
      />
    </React.Fragment>
  );
}

export default DropdownDoctor;
