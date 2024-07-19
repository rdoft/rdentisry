import React from "react";

import dayjs from "dayjs";
import { Dropdown, InputText } from "primereact";
import { Height } from "../../../node_modules/@mui/icons-material/index";

function TimeRangePicker({ start, end, onChange }) {
  const generateOptions = () => {
    const times = [];
    let startTime = dayjs().startOf("day");
    for (let i = 0; i < 24 * 4; i++) {
      times.push({
        label: startTime.format("HH:mm"),
        value: startTime.format("HH:mm"),
      });
      startTime = startTime.add(15, "minute");
    }
    return times;
  };
  const timeOptions = generateOptions();

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let { name, value } = event.target;

    const start = new Date(0);
    const [hours, minutes] = value.split(":").map(Number);
    start.setHours(hours);
    start.setMinutes(minutes);
    onChange({ target: { name, value: start } });
  };

  return (
    <>
      {/* Start */}
      <div className="col-6 md:col-4">
        <Dropdown
          className="w-full"
          name="startTime"
          value={dayjs(start).format("HH:mm")}
          options={timeOptions}
          onChange={handleChange}
          placeholder="ss:dd"
          style={{ height: "3rem" }}
        />
      </div>

      <label className="flex-none mx-2 my-auto font-bold text-center">-</label>

      {/* End */}
      <div className="col-6 md:col-4">
        <InputText
          className="w-full"
          name="endTime"
          value={dayjs(end).format("HH:mm")}
          disabled
          placeholder="ss:dd"
        />
      </div>
    </>
  );
}

export default TimeRangePicker;
