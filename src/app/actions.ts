"use server";

import { db } from "@/lib/db";
import { z } from "zod";

export async function getAllCategory() {
  try {
    const categories = await db.category.findMany();
    return { success: true, categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return {
      success: false,
      error: "Failed to fetch categories",
      categories: [],
    };
  }
}

export async function createEvent(data: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  categoryId?: string;
}) {
  try {
    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        categoryId: data.categoryId ?? null,
      },
      include: {
        category: true,
      },
    });
    return { success: true, event };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function getAllEvents() {
  try {
    const events = await db.event.findMany({
      include: { category: true },
      orderBy: { startTime: "asc" },
    });
    return { success: true, events };
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return { success: false, error: "Failed to fetch events", events: [] };
  }
}

const eventsRangeSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export async function getEventsByRange(input: { start: string; end: string }) {
  try {
    const { start, end } = eventsRangeSchema.parse(input);
    const startDate = new Date(start);
    const endDate = new Date(end);

    const events = await db.event.findMany({
      where: {
        startTime: { lt: endDate },
        endTime: { gt: startDate },
      },
      include: { category: true },
      orderBy: { startTime: "asc" },
    });

    return { success: true, events };
  } catch (error) {
    console.error("Failed to fetch events by range:", error);
    return { success: false, error: "Failed to fetch events", events: [] };
  }
}

export async function deleteEvent(id: string) {
  try {
    await db.event.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

const aiGeneratedEventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    category: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
  })
  .refine((value) => value.endTime > value.startTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });

const aiEventsPayloadSchema = z.object({
  events: z.array(aiGeneratedEventSchema).min(1).max(100),
});

export async function createEventWithAI(prompt: string) {
  try {
    if (!prompt.trim()) {
      return { success: false, error: "Prompt is required" };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "OPENAI_API_KEY is missing. Please add it to your .env file.",
      };
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
    const categories = await db.category.findMany({
      select: { id: true, name: true },
    });

    const categoryList =
      categories.length > 0
        ? categories.map((category) => `${category.id}: ${category.name}`).join("\n")
        : "No categories available. Use null for category/categoryId.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              "You convert natural language into one or more calendar events.",
              "Return valid JSON only with this shape:",
              '{ "events": [{ "title": string, "description": string|null, "startTime": ISO-8601 string, "endTime": ISO-8601 string, "category": string|null, "categoryId": string|null }] }',
              "Expand recurring requests into concrete occurrences.",
              "Respect explicit ranges such as this week/next week/for 4 weeks.",
              "If no date range is given, return only one event.",
              "Use the user's locale/timezone interpretation unless explicitly stated otherwise.",
              "For category, prefer an existing categoryId when certain.",
              "If no exact existing category fits, set category to a short name from the user request and leave categoryId null.",
              "If category is not clear, set both category and categoryId to null.",
              `Current time: ${new Date().toISOString()}`,
              `Available categories (id: name):\n${categoryList}`,
            ].join("\n"),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI API error:", errorBody);
      return { success: false, error: "Failed to generate event with AI" };
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;

    if (!content) {
      return { success: false, error: "AI returned an empty result" };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse AI JSON:", error);
      return { success: false, error: "AI response was not valid JSON" };
    }

    const { events: parsedEvents } = aiEventsPayloadSchema.parse(parsedJson);
    const categoryIdByName = new Map(
      categories.map((category) => [category.name.toLowerCase(), category.id]),
    );

    const resolveCategoryId = async (value: string | null | undefined) => {
      const normalized = value?.trim();
      if (!normalized) return null;

      const matchedById = categories.find((category) => category.id === normalized);
      if (matchedById) return matchedById.id;

      const matchedByName = categoryIdByName.get(normalized.toLowerCase());
      if (matchedByName) return matchedByName;

      const createdCategory = await db.category.create({
        data: { name: normalized },
      });
      categories.push({ id: createdCategory.id, name: createdCategory.name });
      categoryIdByName.set(createdCategory.name.toLowerCase(), createdCategory.id);
      return createdCategory.id;
    };

    const eventsData = await Promise.all(
      parsedEvents.map(async (event) => {
        const categoryInput = event.categoryId ?? event.category;
        const resolvedCategoryId = await resolveCategoryId(categoryInput);
        return {
          title: event.title,
          description: event.description ?? null,
          startTime: event.startTime,
          endTime: event.endTime,
          categoryId: resolvedCategoryId,
        };
      }),
    );

    const createdEvents = await db.$transaction(
      eventsData.map((eventData) =>
        db.event.create({
          data: eventData,
          include: { category: true },
        }),
      ),
    );

    return {
      success: true,
      totalCreated: createdEvents.length,
      event: createdEvents[0],
      events: createdEvents,
    };
  } catch (error) {
    console.error("Failed to create event with AI:", error);
    return { success: false, error: "Failed to create event with AI" };
  }
}
