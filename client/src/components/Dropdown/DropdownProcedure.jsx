import React from "react";
import { Dropdown, Divider } from "primereact";
import DropdownProcedureItem from "components/Dropdown/DropdownItem/DropdownProcedureItem";
import ActionGroup from "components/ActionGroup/ActionGroup";

function DropdownProcedure({ value, options, onChange, onClickAdd }) {
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
      onClickAdd && (
        <div className="m-2">
          <Divider className="mt-0 mb-2" />
          <ActionGroup label="Tedavi Ekle" onClickAdd={onClickAdd} />
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
        valueTemplate={procedureDropdownValue}
        itemTemplate={procedureDropdownItem}
        panelFooterTemplate={procedureDropdownFooter}
        onChange={onChange}
        scrollHeight="300px"
        filter
        filterBy="name,code,procedureCategory.title"
        placeholder="Tedavi seçiniz..."
        emptyMessage="Sonuç bulunamadı"
        emptyFilterMessage="Sonuç bulunamadı"
      />
    </React.Fragment>
  );
}

export default DropdownProcedure;
