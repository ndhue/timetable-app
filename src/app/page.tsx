import { MyCalendar } from "@/components/views/calendar";

export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-3/4 h-3/4">
        <MyCalendar />
      </div>
    </div>
  );
}
