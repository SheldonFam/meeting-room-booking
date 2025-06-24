export interface BookingEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // e.g. "2024-06-01"
  endDate: string; // e.g. "2024-06-02"
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:00"
  roomId: string;
  attendees: number;
  color?: string; // for calendar
  createdBy?: string; // user ID or name
  editedBy?: string; // user ID or name
}
