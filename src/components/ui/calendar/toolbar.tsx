import { CalendarEvent } from "@/types/calendar";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ToolbarProps } from "react-big-calendar";
import { Button } from "../button";

export const CalendarToolbar = ({
  label,
  onNavigate,
  onView,
}: ToolbarProps<CalendarEvent, CalendarEvent>) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onNavigate("PREV")}
          size="icon"
        >
          <ChevronLeftIcon className="size-6" />
        </Button>
        <Button
          variant="outline"
          onClick={() => onNavigate("NEXT")}
          size="icon"
        >
          <ChevronRightIcon className="size-6" />
        </Button>
        <Button onClick={() => onNavigate("TODAY")}>Today</Button>
      </div>
      <span className="font-semibold">{label}</span>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onView("month")}>
          Month
        </Button>
        <Button variant="secondary" onClick={() => onView("week")}>
          Week
        </Button>
      </div>
    </div>
  );
};
