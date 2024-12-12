/*
  Warnings:

  - You are about to drop the column `idPenerbit` on the `Buku` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Buku" DROP CONSTRAINT "Buku_idPenerbit_fkey";

-- AlterTable
ALTER TABLE "Buku" DROP COLUMN "idPenerbit",
ADD COLUMN     "penerbit" INTEGER;

-- AddForeignKey
ALTER TABLE "Buku" ADD CONSTRAINT "Buku_penerbit_fkey" FOREIGN KEY ("penerbit") REFERENCES "Penerbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
