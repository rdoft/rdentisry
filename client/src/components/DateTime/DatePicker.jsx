import React from "react";
import { tr } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';

// assets
import 'react-day-picker/dist/style.css';

function DatePicker({ value, onChange, ...props }) {
  
  return (
    <DayPicker
      mode="single"
      selected={value}
      onSelect={onChange}
      locale={tr}
      {...props}
    />
  );
}

export default DatePicker;
