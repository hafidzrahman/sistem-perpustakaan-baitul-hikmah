/*
  Warnings:

  - You are about to drop the column `idSumbanganBantuan` on the `EksemplarBuku` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EksemplarBuku" DROP CONSTRAINT "EksemplarBuku_idSumbanganBantuan_fkey";

-- AlterTable
ALTER TABLE "EksemplarBuku" DROP COLUMN "idSumbanganBantuan";
