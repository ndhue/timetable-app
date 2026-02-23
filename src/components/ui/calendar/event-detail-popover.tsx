"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/app/actions";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  event: CalendarEvent;
  children: React.ReactNode;
}

const EventDetailPopover = ({ event, children }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete event "${event.title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteEvent(event.id);
      if (!result.success) {
        toast.error("Failed to delete event", {
          description: result.error,
        });
        return;
      }

      toast.success("Event deleted");
      window.dispatchEvent(new Event("events:refresh"));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="space-y-3">
        <div className="space-y-1">
          <p className="font-semibold">{event.title}</p>
          <p className="text-xs text-muted-foreground">
            {format(event.start, "EEE, MMM d yyyy HH:mm")} -{" "}
            {format(event.end, "EEE, MMM d yyyy HH:mm")}
          </p>
        </div>

        {event.description ? (
          <p className="text-sm text-muted-foreground">{event.description}</p>
        ) : null}

        {event.isConflicted ? (
          <p className="text-xs text-destructive font-medium">
            This event overlaps with another event.
          </p>
        ) : null}

        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          Delete event
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default EventDetailPopover;
