import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

export function DateTimePicker({
  label,
  value,
  onChange,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);
  const [hour, setHour] = useState(date?.getHours() || 0);
  const [minute, setMinute] = useState(date?.getMinutes() || 0);

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    const newDate = new Date(day);
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    setDate(newDate);
    onChange(newDate);
  };

  const updateTime = (h: number, m: number) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setHours(h);
    newDate.setMinutes(m);
    setHour(h);
    setMinute(m);
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "rounded-full hover:bg-transparent hover:text-accent",
              className
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2 p-2 w-auto">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
          <div className="flex gap-2 items-center">
            <span className="text-sm ml-2 font-medium">Time: </span>
            <Select
              value={String(hour)}
              onValueChange={(h) => updateTime(+h, minute)}
            >
              <SelectTrigger className="w-[70px]">{String(hour)}</SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, h) => (
                  <SelectItem key={h} value={String(h)}>
                    {h.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(minute)}
              onValueChange={(m) => updateTime(hour, +m)}
            >
              <SelectTrigger className="w-[70px]">
                {String(minute)}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="45">45</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
