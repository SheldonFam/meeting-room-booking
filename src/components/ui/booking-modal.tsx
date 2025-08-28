import { CalendarEvent } from "@/lib/utils";
import { BookingEvent } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "./dialog";
import { BookingForm } from "../booking-form";
import { Room } from "@/types/models";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BookingEvent, "id">) => Promise<void>;
  selectedEvent: CalendarEvent | null;
  initialValues: Partial<BookingEvent>;
  loading: boolean;
  rooms: Room[];
};

export function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  selectedEvent,
  initialValues,
  loading,
  rooms,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 sm:p-6 w-full max-w-full sm:max-w-lg h-full sm:h-auto sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Booking" : "New Booking"}
          </DialogTitle>
          <DialogDescription>
            {selectedEvent
              ? `Editing booking for ${selectedEvent.title}`
              : "Create a new booking"}
          </DialogDescription>
        </DialogHeader>
        <BookingForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          loading={loading}
          rooms={rooms}
          submitLabel={selectedEvent ? "Update Booking" : "Create Booking"}
        />
      </DialogContent>
    </Dialog>
  );
}
