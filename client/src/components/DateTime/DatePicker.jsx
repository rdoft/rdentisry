import React from "react";
import { tr } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

// assets
import "react-day-picker/dist/style.css";

function DatePicker({ value, onChange, minDate, ...props }) {
  const from = new Date(0);
  const to = minDate ? minDate : new Date(0);
  const disabledDays = [{ from: from, to: to }];

  return (
    <DayPicker
      mode="single"
      selected={value}
      onSelect={onChange}
      locale={tr}
      disabled={disabledDays}
      fixedWeeks
      styles={{
        caption: { color: "#333C5E" },
      }}
      modifiersStyles={{
        selected: { backgroundColor: "#21273D" },
      }}
      {...props}
    />
  );
}

export default DatePicker;
