export type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  tag: "study" | "exercise" | string;
};
