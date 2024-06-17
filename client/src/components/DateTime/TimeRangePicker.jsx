import React from "react";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { trTR } from "@mui/x-date-pickers/locales";

function TimeRangePicker({ start, end, onChange }) {
  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    onChange({ target: { name: "startTime", value: event } });
  };

  return (
    <LocalizationProvider
      className="picker-container"
      dateAdapter={AdapterDayjs}
      localeText={
        trTR.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      {/* Start */}
      <MobileTimePicker
        className="col-6 md:col-4"
        value={dayjs(start)}
        onAccept={handleChange}
        ampm={false}
      />

      <label className="col-12 md:col-1 font-bold text-center">-</label>

      {/* End */}
      <MobileTimePicker
        className="col-6 md:col-4"
        disabled={true}
        value={dayjs(end)}
        ampm={false}
      />
    </LocalizationProvider>
  );
}

export default TimeRangePicker;
