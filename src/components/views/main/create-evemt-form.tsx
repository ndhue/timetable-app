"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { createEvent, getAllCategory } from "@/app/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { localizedDate } from "@/lib/utils";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  category: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export const CreateEventForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      startTime: new Date(),
      endTime: new Date(),
      category: "",
    },
  });

  // TODO: add caching soon
  useEffect(() => {
    setCategoryLoading(true);
    getAllCategory()
      .then((result) => {
        if (result.success) {
          setCategories(result.categories);
          setCategoryLoading(false);
        }
      })
      .catch((error) => {
        console.log(error.error);
        setCategoryLoading(false);
      });
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      form.setValue("category", categories[0].id);
    }
  }, [categories, form]);

  const handleSubmit = async (values: EventFormValues) => {
    setIsLoading(true);
    try {
      const result = await createEvent({
        title: values.title,
        description: values.description,
        startTime: values.startTime,
        endTime: values.endTime,
        categoryId: values.category,
      });

      if (result.success && result.event) {
        toast.success("Event has been created", {
          description: `Created at ${localizedDate(new Date(result.event.createdAt))}`,
          // action: {
          //   label: "Undo",
          //   onClick: () => console.log("Undo"),
          // },
        });
        window.dispatchEvent(new Event("events:refresh"));
        form.reset();
      } else {
        console.error("Failed to create event:", result.error);
        toast.success("Failed to create event", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
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

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your description" {...field} />
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
                      DATE_TIME_FORMAT,
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
                      DATE_TIME_FORMAT,
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
          name="category"
          disabled={isCategoryLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl className="w-full">
                <CreateCategoryDialog
                  value={field.value}
                  onChange={field.onChange}
                  categories={categories}
                  isLoading={isCategoryLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
