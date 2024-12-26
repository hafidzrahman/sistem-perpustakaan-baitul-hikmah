/*
  Warnings:

  - The `JKMurid` column on the `Kelas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Kelas" DROP COLUMN "JKMurid",
ADD COLUMN     "JKMurid" TEXT;
