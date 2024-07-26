import React from "react";

import dayjs from "dayjs";
import { Calendar, InputText } from "primereact";

function TimeRangePicker({ start, end, onChange, ...props }) {
  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value) {
      const start = new Date(0);
      start.setHours(value?.getHours() || 0);
      start.setMinutes(value?.getMinutes() || 0);

      onChange({ target: { name, value: start } });
    }
  };

  return (
    <>
      {/* Start */}
      <div className="col-6 md:col-4">
        <Calendar
          className="w-full"
          value={dayjs(start).toDate()}
          onChange={handleChange}
          timeOnly
          showOnFocus={false}
          placeholder="ss:dd"
          mask="99:99"
          style={{ height: "3rem" }}
          {...props}
        />
      </div>

      <label className="flex-none mx-2 my-auto font-bold text-center">-</label>

      {/* End */}
      <div className="col-6 md:col-4">
        <InputText
          className="w-full"
          value={dayjs(end).format("HH:mm")}
          disabled
          placeholder="ss:dd"
        />
      </div>
    </>
  );
}

export default TimeRangePicker;
