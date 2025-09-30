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

interface CreateViaAIDrawerProps {
  onGenerate?: (prompt: string) => Promise<any>; //TODO: api callback
}

export function CreateViaAIDrawer({ onGenerate }: CreateViaAIDrawerProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await onGenerate?.(prompt);
      console.log(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer>
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
