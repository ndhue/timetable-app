import EventDetailPopover from "@/components/ui/calendar/event-detail-popover";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { useMemo } from "react";

interface Props {
  event: CalendarEvent;
}

export const MonthEvent = ({ event }: Props) => {
  const { id, title, tag, start, end } = event;

  const customTime = useMemo(() => {
    return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
  }, [start, end]);

  return (
    <EventDetailPopover key={id}>
      <div className="flex flex-col text-xs space-y-0.5">
        <div className="font-semibold text-xs">{title}</div>
        <div className="text-xs">{customTime}</div>
        <div className="w-fit text-[10px] bg-secondary text-secondary-foreground rounded-sm py-0.5 px-2">
          {tag}
        </div>
      </div>
    </EventDetailPopover>
  );
};

export const WeekEvent = ({ event }: Props) => {
  const { id, title, tag, start, end } = event;

  const customTime = useMemo(() => {
    return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
  }, [start, end]);

  return (
    <EventDetailPopover key={id}>
      <div className="flex flex-col text-xs space-y-0.5">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-xs">{title}</div>
          <div className="w-fit text-[10px] bg-secondary text-secondary-foreground rounded-sm py-0.5 px-2">
            {tag}
          </div>
        </div>
        <div className="text-xs">{customTime}</div>
      </div>
    </EventDetailPopover>
  );
};
