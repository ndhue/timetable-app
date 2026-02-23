export type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;
  start: Date;
  end: Date;
  tag: "study" | "exercise" | string;
  isConflicted?: boolean;
};
