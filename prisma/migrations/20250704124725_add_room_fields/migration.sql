/*
  Warnings:

  - Added the required column `capacity` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilities` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomDescription` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "facilities" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "roomDescription" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
