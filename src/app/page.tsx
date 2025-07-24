"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import dynamic from "next/dynamic";
import { BookingCard } from "@/components/ui/booking-card";
import { DatePicker } from "@/components/ui/date-picker";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

// Dynamically import the BigCalendar component and disable server-side rendering
// const BigCalendar = dynamic(
//   () => import("@/components/ui/big-calendar").then((mod) => mod.BigCalendar),
//   {
//     ssr: false,
//   }
// );

// interface Event {
//   id: string;
//   title: string;
//   startTime: string;
//   endTime: string;
//   color: string;
//   description?: string;
// }

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { setTheme } = useTheme();
  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };
  // const rooms = [
  //   {
  //     id: 1,
  //     name: "Conference Room A",
  //     capacity: 10,
  //     location: "Floor 1,West Wing",
  //     roomDescription:
  //       "A spacious room suitable for team meetings and presentations.",
  //     facilities: ["Projector", "Whiteboard", "Video Conferencing"],
  //     status: "available" as const,
  //     imageUrl: "/images/room1.jpg", // Use the imported image source
  //   },
  //   {
  //     id: 2,
  //     name: "Meeting Room B",
  //     capacity: 6,
  //     location: "Floor 1,West Wing",
  //     roomDescription:
  //       "A spacious room suitable for team meetings and presentations.",
  //     facilities: ["TV Screen", "Whiteboard"],
  //     status: "occupied" as const,
  //     imageUrl: "/images/room2.jpg", // Use the imported image source
  //   },
  //   {
  //     id: 3,
  //     name: "Board Room",
  //     capacity: 20,
  //     location: "Floor 1,West Wing",
  //     roomDescription:
  //       "A spacious room suitable for team meetings and presentations.",
  //     facilities: ["Projector", "Video Conferencing", "Catering"],
  //     status: "maintenance" as const,
  //     imageUrl: "/images/room1.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "Small Meeting Room",
  //     capacity: 4,
  //     location: "Floor 1,West Wing",
  //     roomDescription:
  //       "A spacious room suitable for team meetings and presentations.",
  //     facilities: ["TV Screen"],
  //     status: "available" as const,
  //     imageUrl: "/images/room1.jpg", // Use the imported image source
  //   },
  //   {
  //     id: 5,
  //     name: "Large Conference Hall",
  //     capacity: 50,
  //     location: "Floor 1,West Wing",
  //     roomDescription:
  //       "A spacious room suitable for team meetings and presentations.",
  //     facilities: [
  //       "Projector",
  //       "Sound System",
  //       "Microphones",
  //       "Video Conferencing",
  //       "Catering",
  //     ],
  //     status: "available" as const,
  //     imageUrl: "/images/room1.jpg", // Use the imported image source
  //   },
  //   {
  //     id: 6,
  //     name: "Focus Room 1",
  //     capacity: 1,
  //     location: "Floor 1,West Wing",
  //     roomDescription:
  //       "A spacious room suitable for team meetings and presentations.",
  //     facilities: ["Desk", "Monitor"],
  //     status: "occupied" as const,
  //     imageUrl: "/images/room1.jpg", // Use the imported image source
  //   },
  // ];

  // const events = generateSampleEvents();

  // const tabs = [
  //   {
  //     id: "all",
  //     label: "All Rooms",
  //     content: (
  //       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  //         {rooms.map((room) => (
  //           <RoomCard
  //             key={room.id}
  //             {...room}
  //             onBook={() => console.log(`Book ${room.name}`)}
  //           />
  //         ))}
  //       </div>
  //     ),
  //   },
  //   {
  //     id: "available",
  //     label: "Available",
  //     content: (
  //       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  //         {rooms
  //           .filter((room) => room.status === "available")
  //           .map((room) => (
  //             <RoomCard
  //               key={room.id}
  //               {...room}
  //               onBook={() => console.log(`Book ${room.name}`)}
  //             />
  //           ))}
  //       </div>
  //     ),
  //   },
  //   // {
  //   //   id: "calendar",
  //   //   label: "Calendar",
  //   //   content: (
  //   //     <div className="h-[600px]">
  //   //       <BigCalendar
  //   //         events={[] as Event[]}
  //   //         onEventClick={(event: Event) => {
  //   //           console.log("Event clicked:", event);
  //   //           alert(
  //   //             `Event: ${event.title}\nTime: ${new Date(
  //   //               event.startTime
  //   //             ).toLocaleTimeString()} - ${new Date(
  //   //               event.endTime
  //   //             ).toLocaleTimeString()}\nDescription: ${event.description}`
  //   //           );
  //   //         }}
  //   //         onAddEvent={() => {
  //   //           console.log("Add event clicked");
  //   //           alert("Add new event functionality will be implemented here");
  //   //         }}
  //   //       />
  //   //     </div>
  //   //   ),
  //   // },
  // ];

  const handleClick = async () => {
    setIsLoading(true);
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleAlert = () => {
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meeting Room Booking
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Beta</Badge>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Setting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="profile">Profile</SelectItem>
                    <SelectItem value="setting">Settings</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <main>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sample Buttons
            </h2>
            <div className="flex gap-4 items-center mb-4">
              <Button
                variant="default"
                size="default"
                onClick={handleClick}
                loading={isLoading}
              >
                Default Button
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleThemeChange("light")}
              >
                Secondary Small
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleThemeChange("dark")}
              >
                Outline Large
              </Button>
              <Button variant="destructive" size="icon">
                <PlusIcon className="size-4" />
              </Button>
              <Button variant="ghost">Ghost</Button>
              <Button
                variant="link"
                onClick={() => toast("Event has been created")}
              >
                Link
              </Button>
              <Button variant="default" onClick={handleAlert}>
                Show Alert
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Date Picker Sample
              </h3>
              Calendar
              <DatePicker />
            </div>
            <div>
              <BookingCard
                meetingTitle="Board Meeting"
                location="Executive Room"
                attendees="5"
                bookedBy="John Doe"
                date="Jun 5"
                time="10:00AM - 11:00AM"
                status="confirmed"
              />
              {/* <SmallCard
                iconUrl="next.svg"
                title="Available Rooms"
                description={5}
              /> */}
            </div>
          </div>
          <div>sample Dialog</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Username</Label>
                  <Input
                    id="username-1"
                    name="username"
                    defaultValue="@peduarte"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Toaster />
          {showAlert && (
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>Success! Your changes have been saved</AlertTitle>
              <AlertDescription>
                This is an alert with icon, title and description.
              </AlertDescription>
            </Alert>
          )}
        </main>
      </div>
    </div>
  );
}
