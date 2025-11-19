"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createEventWithAI } from "@/app/actions";
import { localizedDate } from "@/lib/utils";

export function CreateViaAIDrawer() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    setLoading(true);
    try {
      const result = await createEventWithAI(prompt);

      if (result.success) {
        const totalCreated = result.totalCreated ?? (result.events?.length ?? 0);
        const createdAt = result.event?.createdAt
          ? localizedDate(new Date(result.event.createdAt))
          : undefined;

        toast.success(
          totalCreated > 1
            ? `${totalCreated} events have been created with AI`
            : "Event has been created with AI",
          {
            description: createdAt ? `First event created at ${createdAt}` : undefined,
          },
        );
        window.dispatchEvent(new Event("events:refresh"));
        setPrompt("");
        setOpen(false);
      } else {
        toast.error("Failed to create event with AI", {
          description: result.error,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event with AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon className="size-5" />
          Add via AI
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Create Schedule via AI</DrawerTitle>
            <DrawerDescription>
              Enter what you want AI to schedule for you.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <Textarea
              placeholder="e.g. Create Chinese study sessions on Mon-Wed-Fri at 7 PM for next 4 weeks"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Generating…" : "Generate"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
