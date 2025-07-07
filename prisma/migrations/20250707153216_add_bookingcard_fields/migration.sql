/*
  Warnings:

  - Added the required column `attendees` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookedBy` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingTitle` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" 
  ADD COLUMN "attendees" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "bookedBy" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "description" TEXT,
  ADD COLUMN "location" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "meetingTitle" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'confirmed';
