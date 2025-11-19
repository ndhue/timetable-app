import { SidebarTrigger } from "@/components/ui/sidebar";
import { MyCalendar } from "@/components/views/calendar";
import CreateEventDrawer from "@/components/views/main/create-event-drawer";
import { CreateViaAIDrawer } from "@/components/views/main/create-event-via-ai-drawer";
import Theme from "@/components/views/theme";

export default function Home() {
  return (
    <div className="w-full h-[calc(100vh-64px)] p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Theme />
        </div>
        <div className="flex items-center gap-3">
          <CreateViaAIDrawer />
          <CreateEventDrawer />
        </div>
      </div>
      <MyCalendar />
    </div>
  );
}
