"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { Calendar } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { MonthEvent, WeekEvent } from "@/components/ui/calendar/event";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CalendarToolbar } from "@/components/ui/calendar/toolbar";
import { getEventsByRange } from "@/app/actions";
import { toast } from "sonner";
import { getMonthVisibleRange, normalizeCalendarRange } from "@/lib/utils";

import { dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import { format, getDay, parse, startOfWeek } from "date-fns";
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

const markConflictedEvents = (events: CalendarEvent[]) => {
  const conflictedIds = new Set<string>();

  for (let i = 0; i < events.length; i += 1) {
    for (let j = i + 1; j < events.length; j += 1) {
      const current = events[i];
      const compared = events[j];
      const isOverlapping =
        current.start < compared.end && compared.start < current.end;

      if (isOverlapping) {
        conflictedIds.add(current.id);
        conflictedIds.add(compared.id);
      }
    }
  }

  return events.map((event) => ({
    ...event,
    isConflicted: conflictedIds.has(event.id),
  }));
};

export const MyCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [visibleRange, setVisibleRange] = useState(() =>
    getMonthVisibleRange(new Date()),
  );
  const eventsCacheRef = useRef<Map<string, CalendarEvent[]>>(new Map());

  const getRangeKey = (rangeStart: Date, rangeEnd: Date) =>
    `${rangeStart.toISOString()}__${rangeEnd.toISOString()}`;

  const loadEvents = useCallback((rangeStart: Date, rangeEnd: Date) => {
    const cacheKey = getRangeKey(rangeStart, rangeEnd);
    const cachedEvents = eventsCacheRef.current.get(cacheKey);
    if (cachedEvents) {
      setEvents(cachedEvents);
      return;
    }

    getEventsByRange({
      start: rangeStart.toISOString(),
      end: rangeEnd.toISOString(),
    })
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
          description: event.description,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          tag: event.category?.name ?? "Uncategorized",
        }));

        const preparedEvents = markConflictedEvents(mappedEvents);
        eventsCacheRef.current.set(cacheKey, preparedEvents);
        setEvents(preparedEvents);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load events.");
      });
  }, []);

  useEffect(() => {
    loadEvents(visibleRange.start, visibleRange.end);
  }, [loadEvents, visibleRange.end, visibleRange.start]);

  useEffect(() => {
    const refreshHandler = () => {
      eventsCacheRef.current.clear();
      loadEvents(visibleRange.start, visibleRange.end);
    };

    window.addEventListener("events:refresh", refreshHandler);
    return () => window.removeEventListener("events:refresh", refreshHandler);
  }, [loadEvents, visibleRange.end, visibleRange.start]);

  const moveEvent = ({
    event,
    start,
    end,
  }: {
    event: CalendarEvent;
    start: string | Date;
    end: string | Date;
  }) => {
    setEvents((prev) => {
      const updatedEvents = prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              start: typeof start === "string" ? new Date(start) : start,
              end: typeof end === "string" ? new Date(end) : end,
            }
          : e,
      );

      return markConflictedEvents(updatedEvents);
    });
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
        onRangeChange={(range) =>
          setVisibleRange(normalizeCalendarRange(range))
        }
        eventPropGetter={(event) =>
          event.isConflicted ? { className: "event-conflict" } : {}
        }
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
