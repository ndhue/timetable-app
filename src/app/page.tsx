"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Button onClick={() => toast.success("This is my toaster")}>
        Click here
      </Button>
    </div>
  );
}
