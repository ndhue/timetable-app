import { SidebarTrigger } from "@/components/ui/sidebar";
import { MyCalendar } from "@/components/views/calendar";
import CreateEventDrawer from "@/components/views/main/create-event-drawer";
import { CreateViaAIDrawer } from "@/components/views/main/create-event-via-ai-drawer";

export default function Home() {
  return (
    <div className="w-full h-[calc(100vh-64px)] p-4 space-y-4">
      <div className="flex justify-between items-center">
        <SidebarTrigger className="" />
        <div className="flex items-center gap-3">
          <CreateViaAIDrawer />
          <CreateEventDrawer />
        </div>
      </div>
      <MyCalendar />
    </div>
  );
}
