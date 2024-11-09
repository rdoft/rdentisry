import React, { useState } from "react";
import { Dropdown, Divider } from "primereact";
import { Add } from "components/Button";
import { useLoading } from "context/LoadingProvider";
import { SkeletonDropdown } from "components/Skeleton";
import { SubscriptionController } from "components/Subscription";
import DropdownPatientItem from "./DropdownItem/DropdownPatientItem";

// assets
import "assets/styles/Other/Dropdown.css";

function DropdownPatient({ value, options, onChange, onClickAdd, ...props }) {
  const { loading } = useLoading();

  const [patient, setPatient] = useState(value);
  const patients = options;

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
    const patient_ = patients.find((patient) => patient.id === value);
    setPatient(patient_);
    onChange(patient_);
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
          <SubscriptionController type="patients" onClick={onClickAdd}>
            <Add label="Hasta Ekle" />
          </SubscriptionController>
        </div>
      )
    );
  };

  return (
    <Dropdown
      value={patient?.id}
      name="patient"
      options={patients}
      optionValue="id"
      optionLabel="id"
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
