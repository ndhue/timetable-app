export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  tag: "study" | "exercise" | string;
};
