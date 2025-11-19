"use client";

import React, { useCallback, useEffect, useState } from "react";
import { enUS } from "date-fns/locale";
import { CalendarEvent } from "@/types/calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { MonthEvent, WeekEvent } from "@/components/ui/calendar/event";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CalendarToolbar } from "@/components/ui/calendar/toolbar";
import { getAllEvents } from "@/app/actions";
import { toast } from "sonner";

import "./style.scss";

import "./style.scss";

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
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const loadEvents = useCallback(() => {
    getAllEvents()
      .then((result) => {
        if (!result.success) {
          toast.error("Failed to load events", {
            description: result.error,
          });
          return;
        }

        const mappedEvents: CalendarEvent[] = result.events.map((event) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          tag: event.category?.name ?? "Uncategorized",
        }));

        setEvents(mappedEvents);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load events.");
      });
  }, []);

  useEffect(() => {
    loadEvents();

    const refreshHandler = () => {
      loadEvents();
    };

    window.addEventListener("events:refresh", refreshHandler);
    return () => window.removeEventListener("events:refresh", refreshHandler);
  }, [loadEvents]);

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
    <>
      <DnDCalendar
        step={15}
        timeslots={4}
        localizer={localizer}
        events={events}
        onEventDrop={moveEvent}
        resizable
        onEventResize={moveEvent}
        selectable
        popup
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
    </>
  );
};
