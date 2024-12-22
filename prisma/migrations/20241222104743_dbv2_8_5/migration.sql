/*
  Warnings:

  - You are about to drop the column `JKmurid` on the `Kelas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Kelas" DROP COLUMN "JKmurid",
ADD COLUMN     "JKMurid" "JenisKelamin";

-- AlterTable
ALTER TABLE "RiwayatKelas" ALTER COLUMN "nomorPresensi" DROP NOT NULL;
