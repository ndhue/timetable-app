"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@/const";
import { DateTimePicker } from "@/components/ui/date-picker";
import { roundToQuarter } from "@/utils";
import { CreateCategoryDialog } from "./create-category-dialog";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startTime: z.date(),
  endTime: z.date(),
  tag: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export const CreateEventForm = () => {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      startTime: new Date(),
      endTime: new Date(),
      tag: "study",
    },
  });

  const handleSubmit = (values: EventFormValues) => {
    console.log("submit", values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Time */}
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="text"
                    value={format(
                      roundToQuarter(field.value),
                      DATE_TIME_FORMAT
                    )}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <DateTimePicker
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  className="absolute right-0 top-0"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Time */}
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="text"
                    value={format(
                      roundToQuarter(field.value),
                      DATE_TIME_FORMAT
                    )}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <DateTimePicker
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  className="absolute right-0 top-0"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tag / Color */}
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl className="w-full">
                <CreateCategoryDialog
                  value={field.value}
                  onChange={field.onChange}
                  categories={["Work", "Study", "Exercise"]} //TODO: get API for this
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};
