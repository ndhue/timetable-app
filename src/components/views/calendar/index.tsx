"use client";

import React, { useState } from "react";
import { enUS } from "date-fns/locale";
import { CalendarEvent } from "@/types/calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { MonthEvent, WeekEvent } from "@/components/ui/calendar/event";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./style.scss";
import { CalendarToolbar } from "@/components/ui/calendar/toolbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop<CalendarEvent, CalendarEvent>(Calendar);

export const MyCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Học tiếng Trung",
      start: new Date(2025, 9, 1, 19, 0),
      end: new Date(2025, 9, 1, 20, 0),
      tag: "study",
    },
    {
      id: 2,
      title: "Đi bơi",
      start: new Date(2025, 9, 2, 17, 0),
      end: new Date(2025, 9, 2, 18, 0),
      tag: "exercise",
    },
  ]);

  const moveEvent = ({
    event,
    start,
    end,
  }: {
    event: CalendarEvent;
    start: string | Date;
    end: string | Date;
  }) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              start: typeof start === "string" ? new Date(start) : start,
              end: typeof end === "string" ? new Date(end) : end,
            }
          : e
      )
    );
  };

  return (
    <DnDCalendar
      step={15}
      timeslots={4}
      localizer={localizer}
      events={events}
      onEventDrop={moveEvent}
      resizable
      onEventResize={moveEvent}
      selectable
      views={["month", "week"]}
      components={{
        toolbar: CalendarToolbar,
        month: {
          event: MonthEvent,
        },
        week: {
          event: WeekEvent,
        },
      }}
    />
  );
};
