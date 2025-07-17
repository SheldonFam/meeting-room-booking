"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Room {
  id: number;
  name: string;
  capacity: number;
  status: string;
  location: string;
}

interface RoomForm {
  name: string;
  capacity: string;
  status: string;
  location: string;
}

const initialRooms: Room[] = [
  {
    id: 1,
    name: "Conference Room A",
    capacity: 10,
    status: "available",
    location: "Floor 1",
  },
  {
    id: 2,
    name: "Meeting Room B",
    capacity: 6,
    status: "maintenance",
    location: "Floor 2",
  },
];

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomForm>({
    name: "",
    capacity: "",
    status: "available",
    location: "",
  });
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: keyof RoomForm) => {
    setForm({ ...form, [name]: value });
  };

  // Open dialog for add/edit
  const openDialog = (room: Room | null = null) => {
    setEditingRoom(room);
    setForm(
      room
        ? {
            name: room.name,
            capacity: String(room.capacity),
            status: room.status,
            location: room.location,
          }
        : { name: "", capacity: "", status: "available", location: "" }
    );
    setDialogOpen(true);
  };

  // Save (add or update)
  const handleSave = () => {
    if (editingRoom) {
      // Update
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingRoom.id
            ? { ...r, ...form, capacity: Number(form.capacity) }
            : r
        )
      );
    } else {
      // Add
      setRooms((prev) => [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
          ...form,
          capacity: Number(form.capacity),
        },
      ]);
    }
    setDialogOpen(false);
  };

  // Delete
  const handleDelete = () => {
    if (!roomToDelete) return;
    setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
    setDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Manage Rooms
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Add, edit, or remove meeting rooms from your organization.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto h-11 px-6 text-base font-semibold shadow-sm">
              + Add New Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full p-8 rounded-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {editingRoom ? "Edit Room" : "Add Room"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Room Name
                </label>
                <Input
                  name="name"
                  placeholder="Room Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Capacity
                  </label>
                  <Input
                    name="capacity"
                    type="number"
                    placeholder="Capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                    min={1}
                    className="h-10"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Status
                  </label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => handleSelectChange(v, "status")}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Location
                </label>
                <Input
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="h-10 px-5"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-10 px-5">
                  {editingRoom ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8" />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-0 md:p-4">
        <Table>
          <TableCaption className="mb-2">
            List of all meeting rooms
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Name</TableHead>
              <TableHead className="w-1/6">Capacity</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/4">Location</TableHead>
              <TableHead className="w-1/6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {room.name}
                </TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>
                  <span
                    className={
                      room.status === "available"
                        ? "inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : room.status === "occupied"
                        ? "inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "inline-block px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }
                  >
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{room.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDialog(room)}
                      className="h-8 px-4"
                    >
                      Edit
                    </Button>
                    <Dialog
                      open={deleteDialogOpen && roomToDelete?.id === room.id}
                      onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) setRoomToDelete(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-4"
                          onClick={() => {
                            setRoomToDelete(room);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm w-full p-6 rounded-xl">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                          Delete Room
                        </h2>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                          Are you sure you want to delete <b>{room.name}</b>?
                        </p>
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="h-9 px-5"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="h-9 px-5"
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
