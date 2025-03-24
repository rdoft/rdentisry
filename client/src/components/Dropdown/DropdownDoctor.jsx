import React, { useState } from "react";
import { Dropdown, Divider } from "primereact";
import { Add } from "components/Button";
import { useLoading } from "context/LoadingProvider";
import { SkeletonDropdown } from "components/Skeleton";
import { SubscriptionController } from "components/Subscription";
import DropdownDoctorItem from "./DropdownItem/DropdownDoctorItem";
import { useTheme } from "@mui/material";
import config from "config/theme.config";

// assets
import "assets/styles/Other/Dropdown.css";

function DropdownDoctor({
  value,
  options,
  onChange,
  onClickAdd,
  onClickDelete,
  ...props
}) {
  const { loading } = useLoading();
  const theme = useTheme();
  const modalZIndex = theme.zIndex?.modal || config.zIndex?.modal || 1300;

  const [doctor, setDoctor] = useState(value);
  const doctors = options;

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
    const doctor_ = doctors.find((doctor) => doctor.id === value);
    setDoctor(doctor_);
    onChange(doctor_);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const doctorDropdownItem = (option) => {
    return <DropdownDoctorItem option={option} onDelete={onClickDelete} />;
  };

  // Dropdown value template
  const doctorDropdownValue = (option) => {
    return loading.doctors ? (
      <SkeletonDropdown />
    ) : (
      <DropdownDoctorItem option={option} />
    );
  };

  // Dropdown panel footer
  const doctorDropdownFooter = () => {
    return (
      <div className="m-2">
        <Divider className="mt-0 mb-2" />
        <SubscriptionController type="doctors" >
          <Add label="Doktor Ekle" onClick={onClickAdd} />
        </SubscriptionController>
      </div>
    );
  };

  return (
    <Dropdown
      value={doctor?.id}
      name="doctor"
      options={doctors}
      optionValue="id"
      optionLabel="id"
      valueTemplate={doctorDropdownValue}
      itemTemplate={doctorDropdownItem}
      panelFooterTemplate={doctorDropdownFooter}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      className={`doctor-selection-dropdown ${props?.className || ''}`}
      style={props?.style}
      filter
      filterBy="name,surname,fullName"
      filterLocale="tr-TR"
      placeholder="Doktor seçiniz..."
      emptyMessage="Sonuç bulunamadı"
      emptyFilterMessage="Sonuç bulunamadı"
      showClear
      panelStyle={{ zIndex: modalZIndex }}
    />
  );
}

export default DropdownDoctor;
