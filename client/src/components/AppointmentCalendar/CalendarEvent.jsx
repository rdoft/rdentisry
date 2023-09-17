import React from "react";
import { Typography } from "@mui/material";

// assets
import {
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";

function convert(event, step) {
  const { date, description, startTime, endTime, id, patient } = event;
  const { name, surname } = event.patient;

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const startHours = startDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endHours = endDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);

  startDate.setFullYear(year);
  startDate.setMonth(month - 1);
  startDate.setDate(day);

  endDate.setFullYear(year);
  endDate.setMonth(month - 1);
  endDate.setDate(day);

  const showName = event.duration >= step;
  const showDescription = description && event.duration >= (step / 3) * 4;

  return {
    title: (
      <div>
        <Typography variant="h6">
          <ClockCircleOutlined /> {`${startHours}-${endHours}`}
        </Typography>
        {showName && (
          <Typography variant="h5">
            <UserOutlined /> {`${name} ${surname}`}
          </Typography>
        )}

        {showDescription && (
          <Typography variant="h6">
            <FileTextOutlined />{" "}
            {description.includes("\n") ||
            description.split(/\n/)[0].length > 24
              ? description.split(/\n/)[0].slice(0, 24) + " ..."
              : description.split(/\n/)[0]}
          </Typography>
        )}
      </div>
    ),
    start: startDate,
    end: endDate,
    id,
    tooltip: `${name} ${surname}`,
    patient,
  };
}

export default convert;
