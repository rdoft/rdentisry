import React from "react";
import { tr } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

// assets
import "react-day-picker/dist/style.css";

function DatePicker({ value, onChange, ...props }) {
  const initday = new Date(0);
  const yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).setUTCHours(0, 0, 0, 0);
  const disabledDays = [{ from: initday, to: yesterday }];

  return (
    <DayPicker
      mode="single"
      selected={value}
      onSelect={onChange}
      locale={tr}
      fixedWeeks
      required
      disabled={disabledDays}
      {...props}
      styles={{
        caption: { color: "#333C5E" },
      }}
      modifiersStyles={{
        selected: { backgroundColor: "#21273D", color: "#fff" },
      }}
    />
  );
}

export default DatePicker;
