import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-react";
import { CreateEventForm } from "./create-evemt-form";

const CreateEventDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon className="size-5" />
          Add an event
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Add New Event</DrawerTitle>
            <DrawerDescription>
              Fill in the details to add a new event to your calendar.
            </DrawerDescription>
          </DrawerHeader>
          <CreateEventForm />
          <DrawerFooter className="px-0">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateEventDrawer;
