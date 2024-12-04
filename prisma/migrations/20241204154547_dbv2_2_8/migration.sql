/*
  Warnings:

  - You are about to drop the column `NISMurid` on the `Sumbangan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sumbangan" DROP CONSTRAINT "Sumbangan_NISMurid_fkey";

-- AlterTable
ALTER TABLE "Sumbangan" DROP COLUMN "NISMurid",
ADD COLUMN     "nip" TEXT,
ADD COLUMN     "nis" TEXT;

-- AddForeignKey
ALTER TABLE "Sumbangan" ADD CONSTRAINT "Sumbangan_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Murid"("nis") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sumbangan" ADD CONSTRAINT "Sumbangan_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE SET NULL ON UPDATE CASCADE;
