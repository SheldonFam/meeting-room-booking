"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { setTheme } = useTheme();
  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

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
